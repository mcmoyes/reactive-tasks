# reactive-tasks
Super tiny reactive task completion library. An experiment built in about 5 hours.


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


## Example:

```javascript 
let milks = 0;
const hasMilk = () => milks > 0;

const task1 = rt.addTask("GetMilk");

task1.when(hasMilk).do(() => {
	console.log("Got Milk!")
});
```
