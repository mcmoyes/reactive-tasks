# reactive-tasks
Super tiny reactive task completion library. An experiment built in about 5 hours.

The idea here was to create a super simple way to execute arbitrary bits of code when a condition is fulfilled. Sort of a _when this is true do this_, closer to a declarative paradigm, using a promise-like syntax stripped of its complexity.

So for example you can do something like: 

```javascript 
let milks = 0;
const hasMilk = () => milks > 0;

const task1 = rt.addTask("GetMilk");

task1.when(hasMilk).do(() => {
	console.log("Got Milk!")
});
```

It also handles multiple dependencies/conditions, and tasks can be used as conditions for other tasks. See example.html for an example.


## Usage:

###	rt.addTask(taskid)
		register a task. currently taskid must be alphanumeric.

###	rt.getTask(taskid)
		get a task by id

	-- Tasks have the following chainable methods:

	.when([ function | taskid | task ], task2, ...)
		register task's dependencies ("is complete") logic. When these functions or tasks evaluate to true,
		the task will be considered completed.
	
	.do(fn1, fn2...)
		callback(s) to execute when task is complete. You can add an arbitrary number of callbacks.

	.$complete(selector)
		when task is complete, adds the .completed class to dom elements specified by a selector



