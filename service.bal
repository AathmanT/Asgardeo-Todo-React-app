import ballerina/http;

service /todoService on new http:Listener(9000) {

    resource function get allTodos() returns Todo[] {
        return todoTable.toArray();
    }

    resource function post saveTodos(@http:Payload Todo[] todoEntries)
                                    returns Todo[]|ConflictingTodoIdsError {

        string[] conflictingIds = from Todo todoEntry in todoEntries
            where todoTable.hasKey(todoEntry.id)
            select todoEntry.id;

        if conflictingIds.length() > 0 {
            return {
                body: {
                    errmsg: string:'join(" ", "Todo Id already exist:", ...conflictingIds)
                }
            };
        } else {
            todoEntries.forEach(todoEntry => todoTable.add(todoEntry));
            return todoEntries;
        }
    }

    resource function get todo/[string id]() returns Todo|InvalidTodoIdError {
        Todo? todoEntry = todoTable[id];
        if todoEntry is () {
            return {
                body: {
                    errmsg: string `Invalid Todo Id: ${id}`
                }
            };
        }
        return todoEntry;
    }
}

public type Todo record {|
    readonly string id;
    string todo_task;
|};

public final table<Todo> key(id) todoTable = table [
    {id: "1", todo_task: "Task1"},
    {id: "2", todo_task: "Task2"},
    {id: "3", todo_task: "Task3"}
];

public type ConflictingTodoIdsError record {|
    *http:Conflict;
    ErrorMsg body;
|};

public type InvalidTodoIdError record {|
    *http:NotFound;
    ErrorMsg body;
|};

public type ErrorMsg record {|
    string errmsg;
|};