'use strict';

(function(){

let $ = function(selector) {
	if(typeof selector === 'string'){   //selector is a string
		return document.querySelectorAll(selector);
	}

	let objSelector = selector.nodeName; //selector is a HTMLElement

	selector.className ? objSelector + '.' + selector.className : objSelector;

	selector.id ? objSelector + '#' + selector.id : objSelector;

	return document.querySelectorAll(objSelector);
}

NodeList.prototype.addClass = function(cls){
	let nodeListLenght = this.length;

	//argument of addClass method is a callback function
	if (cls instanceof Function){ 

		let callback = cls;

		for (let i = 0; i < nodeListLenght ; i++){
	        this[i].className += " " + callback(i,this[i].className);
    	}
	} 
	// argument of addClass method is a string with namespaces or not
	else{ 

	    let classArray = cls.split(' ');

	    for (let i = 0; i < nodeListLenght ; i++){

	        for (let j = 0; j < classArray.length; j++) {
	       		 this[i].classList.add(classArray[j]);
	        }
	    }
	}    
    return this;
}

NodeList.prototype.append = function(node){
	let nodeListLenght = this.length;

	// argument of append method is node of NodeList object
	if (node instanceof NodeList){ 

		for (let i = 0; i < nodeListLenght ; i++){

			for (let j = 0; j < node.length; j++) {

				let cloneNode = node[j].cloneNode(true);
	        	this[i].insertBefore(cloneNode);
			}
		}
	}

	//argument of append method is ELEMENT_NODE
	if (node.nodeType === 1){ 

		for (let i = 0; i < nodeListLenght ; i++){

	        let cloneNode = node.cloneNode(true);
	        this[i].insertBefore(cloneNode);
    	}
	} 
	// argument of append method is a string
	else { 

	    for (let i = 0; i < nodeListLenght ; i++){
	        this[i].innerHTML += node;
	    }
	}    
    return this;
}

NodeList.prototype.html = function(node){
	let nodeListLenght = this.length;
	let firstElementOfNodeList = this[0];

	// html method without arguments return innerHTML of the first Node
	// of NodeList object
	if (!arguments.length){ 

		return firstElementOfNodeList.innerHTML;
	}

	// html method with argument set innerHTML of each selected node
    for (let i = 0; i < nodeListLenght ; i++){ 
        this[i].innerHTML = node;
    }
    return this;
}

NodeList.prototype.attr = function(){
	let nodeListLenght = this.length;
	let firstElementOfNodeList = this[0];
	let firstArgument = arguments[0];
	let secondArgument = arguments[1];

	// attr method with one argument returns value of attribute of the first node
	if (arguments.length === 1){

		return firstElementOfNodeList.getAttribute(firstArgument);
	}

	// attr method with two arguments set attribute(first argument)
	// with value(second argument) of each node
    for (let i = 0; i < nodeListLenght ; i++){
        this[i].setAttribute(firstArgument,secondArgument);
    }
    return this;
}

NodeList.prototype.children = function(){
	let firstElementOfNodeList = this[0];
	let firstArgument = arguments[0];

	// children method without arguments returns collection of child nodes
	// of first matched node
	if (!arguments.length){
		return firstElementOfNodeList.childNodes;
	}

	// children method with argument returns collection of child nodes
	// of first matched node, having class as argument 
    return firstElementOfNodeList.querySelectorAll(firstArgument);
}

NodeList.prototype.css = function(obj){
	let nodeListLenght = this.length;
	let firstElementOfNodeList = this[0];
	let firstArgument = arguments[0];

	// css method with string argument returns value of css property
	// of first matched element
	if ({}.toString.call(firstArgument) === '[object String]'){
		return firstElementOfNodeList.style[firstArgument];
	}

	// css method with object argument sets css properties (keys of object)
	// with values (value of keys of object) of each matched element
    for (let i = 0; i < nodeListLenght; i++) {
    	for (let key in obj){
    		this[i].style[key] = obj[key];
    	}
    }
    return this;
}

NodeList.prototype.data = function(){
	let nodeListLenght = this.length;
	let firstElementOfNodeList = this[0];
	let firstArgument = arguments[0];
	let secondArgument = arguments[1];
	let obj = {};

	// data method without arguments return data with all data attributes
	// of the first element
	if (!arguments.length){

		for (let key in firstElementOfNodeList.dataset) {
    		obj[key] = firstElementOfNodeList.dataset[key];
    	}
    	return obj;
	}

	// data method with one string argument returns value of data attributes
	// of first child
	if (arguments.length === 1 && typeof firstArgument !== 'object'){

		return firstElementOfNodeList.dataset[firstArgument];
	}

	// data method with two arguments sets data attribute (first argument)
	// to value (second argument)
	if (arguments.length === 2){
		for (let i = 0; i < nodeListLenght; i++) {
			this[i].dataset[firstArgument] = secondArgument;
		}	
	} 

	// data method with object argument sets data attributes (keys of object)
	// with values (value of keys of object) of all children
	else{

	    for (let key in firstArgument) {
	    	for (let i = 0; i < nodeListLenght; i++) {
				this[i].dataset[key] = firstArgument[key];
			}	
	    }
	}    
    return this;
}

NodeList.prototype.on = function(){
	let firstElementOfNodeList = this[0];
	let firstArgument = arguments[0];
	let secondArgument = arguments[1];
	let callback = arguments[2];

	// on method with two arguments adds event listener
	if (arguments.length === 2){
		firstElementOfNodeList.addEventListener(firstArgument,secondArgument);
	} 

	// on method with tree arguments deligates event to child
	// node which matches to selector (second arguments)
	else {

		firstElementOfNodeList.addEventListener(firstArgument,function(event){
			if(event.target.classList.contains(secondArgument.slice(1))){
				callback();
			}
		});
	}	
	return this;	
}

NodeList.prototype.one = function(){
	let firstElementOfNodeList = this[0];
	let firstArgument = arguments[0];
	let secondArgument = arguments[1];

	// one method adds event listener that will be removed after first execution
	addEventListenerOnce(firstElementOfNodeList,firstArgument,secondArgument);
	return this;	
}

// addEventListenerOnce is a function for adding event listener
// that will be removed after first execution
function addEventListenerOnce(target, type, listener) {
    target.addEventListener(type, function fn(event) {
        target.removeEventListener(type, fn);
        listener(event);
    });
}

NodeList.prototype.each = function(f){
	let nodeListLenght = this.length;
	let callbackRezult;

	// each method passes index of iteration and node to callback
	for (let i = 0; i < nodeListLenght; i++) {

		callbackRezult = f.call(this[i],i,this[i]);

		// each methos should stop looping if callback returned false
		if(callbackRezult === false){
			return this;
		}
	}
	return this;	
}

window.$ = $;

}());