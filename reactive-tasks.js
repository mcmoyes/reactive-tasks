/*
Reactive task-completion manager

Usage:

	rt.addTask(taskid)
		register a task. currently taskid must be alphanumeric.

	rt.getTask(taskid)
		get a task by id

	-- Tasks have the following chainable methods:

	.when([ function | taskid | task ], task2, ...)
		register task's dependencies ("is complete") logic. When these functions or tasks evaluate to true,
		the task will be considered completed.
	
	.do(fn1, fn2...)
		callback(s) to execute when task is complete. You can add an arbitrary number of callbacks.

	.$complete(selector)
		when task is complete, adds the .completed class to dom elements specified by a selector


Example:

var tm = new ReactiveTasks();
var milks = 0;
var hasMilk = function() {
	return milks > 0;
}

var task1 = tm.addTask("GetMilk");

task1.when(hasMilk).do(
	function() {
		console.log("Got Milk!")
    });
);

*/

/* TODOS:
    - rename lib
	- add.then(fn, miliseconds), for chaining. Does this need a separate action object?
	- DOM attributes
*/
var rt = (function ReactiveTasks() {

    var tm = function TaskManager() {

        const settings = {
            listenInterval: 250
        }

        const tasks = {};

        let _addTask = (id) => {
            if (!tasks.hasOwnProperty(id)) {
                tasks[id] = new Task(id);
            } else {
                console.warn("TaskManager: attempted to add duplicate task with id " + id);
            }
            // for chaining.
            return tasks[id];
        }

        let _getTask = (id) => tasks[id];

        return {
            addTask: _addTask,
            getTask: _getTask,
            settings: settings
        }
    }();

    function Task(id) {

        this.id = id;
        let dependencyFns = [],
            completeSubs = [],
            immortal = false; // not implemented yet

        this.completed = false;
        this.active = false; // TODO.

        this.do = (...callbacks) => {
            completeSubs = [...completeSubs, ...callbacks];
            return this;
        }

        this.when = (...dependencies) => {
            registerDependencies(dependencies);
            return this;
        }

        this.$complete = (selector) => {
            this.do(() => {
                addCompletedClass(selector);
            });
            return this;
        }

        // add .completed class to elements with selector
        function addCompletedClass(selector) {
            let els = document.querySelectorAll(selector);
            els.forEach((el) => {
                el.classList.add('completed')
            });

        }

        this.isComplete = () => this.completed;

        // keep polling even after complete. This will be useful when tasks
        // can be uncompleted (not yet).
        // TODO: smarter to just set this if there's an uncomplete function.
        this.forever = () => {
            immortal = true;
        }



        let registerDependencies = (dependencies) => {
            dependencies.forEach(
                (dependency) => { registerDependency(dependency); }
            )
            checkDependencies();
        }

        let registerDependency = (dependency) => {
            let dependencyFn = null; // for legibility / clarity

            // check dependency type: string (taskid), task object or fn?
            if (typeof dependency === "string") {
                let thisTask = tm.getTask(dependency);
                if (thisTask) {
                    dependencyFn = thisTask.isComplete;
                }
            } else if (dependency.hasOwnProperty('isComplete')) {
                dependencyFn = dependency.isComplete;
            } else {
                dependencyFn = dependency;
            }

            dependencyFns.push(dependencyFn);


        }

        // check dependencies infinite loop
        let checkDependencies = () => {
            if (!this.isComplete()) {

                dependencyFns.forEach((fn, index, object) => {
                    if (fn()) {
                        // remove the function from dependencyFns
                        object.splice(index, 1);
                    }
                });
                if (dependencyFns.length == 0) {

                    completeSubs.forEach(function (fn) {
                        fn();
                    });
                    this.completed = true;
                }
            }
            window.requestAnimationFrame(checkDependencies);

        }

        return this;
    }

    return tm;
})();
