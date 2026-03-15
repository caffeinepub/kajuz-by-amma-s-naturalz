import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  module Todo {
    public type Validated = {
      description : Text;
      completed : Bool;
    };

    public type ValidatedInput = {
      id : Nat;
      description : Text;
      completed : Bool;
    };

    public func compare(a : ValidatedInput, b : ValidatedInput) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  type TodoList = Map.Map<Nat, Todo.Validated>;

  var nextId = 0;
  let todoLists = Map.empty<Principal, TodoList>();
  let userProfiles = Map.empty<Principal, Text>();
  let orders = Map.empty<Nat, Text>();
  var nextOrderId = 0;

  // Access Control State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // First admin claim: first caller becomes admin, no token needed
  public shared ({ caller }) func claimFirstAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    if (accessControlState.adminAssigned) { return false };
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true
  };

  // Safe isCallerAdmin: returns false instead of trapping for unregistered users
  public query ({ caller }) func isCallerAdminSafe() : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) { true };
      case (_) { false };
    };
  };

  // Order Management
  public shared ({ caller }) func saveOrder(orderJson : Text) : async Nat {
    let id = nextOrderId;
    orders.add(id, orderJson);
    nextOrderId += 1;
    id
  };

  public query ({ caller }) func getOrders() : async [Text] {
    orders.toArray().map(func((_, v)) { v });
  };

  // User Management
  public shared ({ caller }) func signUp(username : Text) : async () {
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("This user is already registered.");
    };
    userProfiles.add(caller, username);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Text {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func isRegistered() : async Bool {
    userProfiles.containsKey(caller);
  };

  // Todo Management
  public query ({ caller }) func getTodos() : async ?[Todo.ValidatedInput] {
    if (not (userProfiles.containsKey(caller))) {
      Runtime.trap("Unauthorized: Only registered users can access todos");
    };
    switch (todoLists.get(caller)) {
      case (null) { null };
      case (?todos) {
        ?todos.toArray().map(
          func((id, todo)) {
            { todo with id };
          }
        );
      };
    };
  };

  public query ({ caller }) func getTodo(id : Nat) : async ?Todo.Validated {
    if (not (userProfiles.containsKey(caller))) {
      Runtime.trap("Unauthorized: Only registered users can access todos");
    };
    switch (todoLists.get(caller)) {
      case (null) { null };
      case (?todos) { todos.get(id) };
    };
  };

  // Shared function to verify todo existence and ownership
  func verifyTodo(todos : TodoList, id : Nat) : () {
    if (not todos.containsKey(id)) {
      Runtime.trap("Todo does not exist");
    };
  };

  public shared ({ caller }) func addTodo(description : Text) : async () {
    if (not (userProfiles.containsKey(caller))) {
      Runtime.trap("Unauthorized: Only registered users can add todos");
    };

    let newTodo : Todo.Validated = {
      description;
      completed = false;
    };

    let todos : TodoList = switch (todoLists.get(caller)) {
      case (null) { Map.empty<Nat, Todo.Validated>() };
      case (?todos) { todos };
    };

    todos.add(nextId, newTodo);
    todoLists.add(caller, todos);
    nextId += 1;
  };

  public shared ({ caller }) func editTodo(id : Nat, description : Text) : async () {
    if (not (userProfiles.containsKey(caller))) {
      Runtime.trap("Unauthorized: Only registered users can edit todos");
    };
    let todos = switch (todoLists.get(caller)) {
      case (null) { Runtime.trap("Todo does not exist. ") };
      case (?todos) {
        verifyTodo(todos, id);
        todos;
      };
    };
    let updatedTodos = Map.fromIter<Nat, Todo.Validated>(
      todos.entries().map(
        func((todoId, todo)) {
          if (todoId == id) {
            (todoId, { todo with description });
          } else {
            (todoId, todo);
          };
        }
      )
    );
    todoLists.add(caller, updatedTodos);
  };

  public shared ({ caller }) func toggleTodo(id : Nat) : async () {
    if (not (userProfiles.containsKey(caller))) {
      Runtime.trap("Unauthorized: Only registered users can toggle todos");
    };

    // Check if the todo exists and is owned by the caller
    let todos = switch (todoLists.get(caller)) {
      case (null) { Runtime.trap("Todo does not exist. ") };
      case (?todos) {
        verifyTodo(todos, id);
        todos;
      };
    };
    let updatedTodos = Map.fromIter<Nat, Todo.Validated>(
      todos.entries().map(
        func((todoId, todo)) {
          if (todoId == id) {
            (todoId, { todo with completed = not todo.completed });
          } else {
            (todoId, todo);
          };
        }
      )
    );
    todoLists.add(caller, updatedTodos);
  };

  public shared ({ caller }) func deleteTodo(id : Nat) : async () {
    if (not (userProfiles.containsKey(caller))) {
      Runtime.trap("Unauthorized: Only registered users can delete todos");
    };
    let todos = switch (todoLists.get(caller)) {
      case (null) { Runtime.trap("Todo does not exist. ") };
      case (?todos) {
        verifyTodo(todos, id);
        todos;
      };
    };
    let updatedTodos = Map.fromIter<Nat, Todo.Validated>(
      todos.entries().filter(
        func((todoId, _)) {
          todoId != id;
        }
      )
    );
    todoLists.add(caller, updatedTodos);
  };
};
