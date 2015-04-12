/*
	Improvements:
		- Either use DOM to store structures (children etc) or data hash.  Not both.  It's redundant
*/

var async = require("async"),
	_ = require("lodash");

module.exports = function Tree(config) {

	var idSelected = null,
		idFocus = null,
		idEditing = null,
		divTree = document.getElementById(config.domID),
		data = {};

	divTree.className = "tree";

	// load root node
	loadNode(config.rootID, function (err) {
		if (err)
			return console.error("Couldn't load root node");

		expandNode(config.rootID, true);
		focusNode(config.rootID);
		selectNode(config.rootID);
	});

	document.onselectstart = function (e) {
		return checkEdit();
	};

	document.addEventListener("mousedown", function (e) {
		return checkEdit();
	});

	document.addEventListener("contextmenu", function(e) {
		if (typeof config.onContext == "function") {
			config.onContext(null, function (err, data) {
				data.push({
					name:'Refresh',
					action:function(id) {
						location.reload();
					}
				});
				
				// show our context menu
				showContext(null, data);
			});
		}
		
		var evt=fixe(e);
		evt.cancelBubble = true;
		return false; // otherwise it keeps firing...
	});



	window.onkeydown = function(e) {
		
		var evt=fixe(e),
			l_id,
			keyCode = evt.charCode || evt.keyCode;
		
		switch (keyCode) {
			case 38: // UP
			
				// might be ampersand... no idea why it has the same keycode
				if (evt.shiftKey)
					return true;
					
				if (!editNodeNameChange()) {
					l_id = getPreviousVisible(idFocus);
					if (l_id)
						focusNode(l_id);
				}
				return false;
				
			case 40: // DOWN
				if (!editNodeNameChange()) {
					if (idFocus) {
						l_id = getNextVisible(idFocus);
						if (l_id)
							focusNode(l_id);
					}
				}
				return false;
				
			case 39: // RIGHT
				if (idEditing)
					return true;
				expandNode(idFocus, true);
				return false;
				
			case 37: // LEFT
				if (idEditing)
					return true;
				expandNode(idFocus, false);
				return false;
				
			case 113: // F2
				editNodeName(idFocus);
				return false;
				
			case 13: // enter
				if (!editNodeNameChange()) {
					selectNode(idFocus);
				}
				return false;

			case 27:  // escape
				if (idEditing) {
					// reset name change
					data[idEditing].divName.innerHTML = data[idEditing].name;
					editNodeNameChange();
					return true;
				}
				return false;

// 			default:
// 				console.log(keyCode);
		}
	}


	function checkEdit() {
		if (idEditing) {
	//		editNodeNameChange(null)
			return true;
		}
		
		hideContext();
		return false;
	}



	function loadNode(id, cb) {
		// async function
		config.onLoad(id, function (err, name, image, children) {
			if (err)
				return cb(err);
			
			createNode(id, name, image, children);
			cb();
		});
	}


	function createNode(id, name, image, children) {
		
		var l_data;
		
		if (data[id]) {
			// we already have it
			l_data = data[id];
		} else {
			l_data = new Object();
			// store it
			data[id] = l_data;
		}
		
 		l_data.id = id;
 		l_data.name = name;
 		l_data.image = image;
 		l_data.children = children;


		if (l_data.div) {
			// node already exists
			// update name
			l_data.divName.innerHTML = l_data.name;
			
			// udpate image
			l_data.img.setAttribute("src", config.iconPath + l_data.image);

			// has parent changed?
			var parentID = findParent(id);

			if (parentID != l_data.parentID) {
				// reparent
				l_data.parentID = parentID;
				// remove from parent
				l_data.div.parentNode.removeChild(l_data.div);
				// add child to parentID
				addChild(id);
			}

		} else {
			// create new div
			var l_div = document.createElement("div");
			
			// store id
			l_data.id = id;
			// set main div's dom id
			l_div.id = id;
			// store main div
			l_data.div = l_div;
			
			l_data.expanded = false;
			
			// cache parent
			l_data.parentID = findParent(id);

			// add div
			addChild(id);
			
			// add drop target response (when draggin another div)
			l_div.onmouseover = function(e) {
				if ((divDragging) || (divDragWaiting)) {
					if (setDropTarget(this, false)) {
						var evt=fixe(e);
						evt.cancelBubble = true;
						return false;
					}
				}
			}
			
			
			// create elements
			// div for drop target before current node
			var l_divDrop = document.createElement("div");
			l_div.appendChild(l_divDrop);
			l_data.divDrop = l_divDrop;
			l_divDrop.idNode = id;
			l_divDrop.className = "dropOff";
			
			l_divDrop.onmouseover = function (e){
				focusNode(this.idNode);
				if ((divDragging) || (divDragWaiting)) {
					if (setDropTarget(data[this.idNode].div, true)) {
						var evt=fixe(e);
						evt.cancelBubble = true;
						return false;
					}
				}
			}
			
			
			// div holding current node
			var l_divNode = document.createElement("div");
			l_div.appendChild(l_divNode);
			l_data.divNode = l_divNode;
			l_divNode.idNode = id;
			l_divNode.className = "node";
			
			l_divNode.onmousedown = function (e) {
				var evt=fixe(e);
				
				// are we editing this node?
				if (idEditing == this.idNode)
					return true;
			
				//eval (unescape(data[this.idNode].load))
				selectNode(this.idNode);
				
				// in case we were dragging...
				endDrag();
				
				// start a drag (wait for it)
				if (typeof config.onDrop == "function")
					if (document.getElementById(data[this.idNode].parentID))
						divDragWaiting = data[this.idNode].div;

				evt.cancelBubble = true;
				return false;
			}
			
			l_divNode.oncontextmenu = function(e) {
				// select this node
				//selectNode(this.idNode)
				
				if (typeof config.onContext == "function")
					config.onContext(data[this.idNode].id, function (err, data) {
						// show our context menu
						showContext(id, data);
					});

				var evt=fixe(e);
				evt.cancelBubble = true;
				return false; // otherwise it keeps firing...
			}
			
			// the plus/minus sign to expand/collapse
			var l_plus = document.createElement("div");
			l_divNode.appendChild(l_plus);
			l_data.plus = l_plus;
			l_plus.idNode = id;
			
			l_plus.className = "expand";
			// add interactivity
			l_plus.onmousedown = function(e) {
				expandNode(this.idNode, !data[this.idNode].expanded);
				var evt=fixe(e);
				evt.cancelBubble = true;
				return false;
			}
			
			// node icon
			var l_img = document.createElement("img");
			l_divNode.appendChild(l_img);
			l_data.img = l_img;
			
			l_img.setAttribute("src", config.iconPath + l_data.image);
			l_img.className = "nodeImage";
			
			
			// name div
			var l_divName = document.createElement("div");
			l_divNode.appendChild(l_divName);
			l_data.divName = l_divName;
			l_divName.idNode = id;
			
			if (id == idSelected)
				l_divName.className = "nodeNameSelected";
			else if (id == idFocus)
				l_div.className = "nodeNameOver";
			else
				l_divName.className = "nodeName";
				
			l_divName.innerHTML = l_data.name;
			
			l_divName.onmouseover = function(e) {
				focusNode(this.idNode);
			}
			
			l_divName.ondblclick = function (e) {
				editNodeName(this.idNode);
			}
			
			/*
			l_divName.onpaste = function (e) {
				alert (e.currentTarget.innerHTML)
				//set time out event and clean text
			}
			*/
			
			// children div
			var l_divChildren = document.createElement("div");
			l_div.appendChild(l_divChildren);
			l_data.divChildren = l_divChildren;
			
			l_divChildren.className = "childNodesHidden";

			if (loadExpanded(id)) {
				expandNode(id, true);
			}
		}

		// applies to both existing and new nodes
		updatePlus(id);
	}


	function updatePlus(id) {
		var l_data = data[id];

		// set plus sign
		l_data.plus.innerHTML = l_data.children.length ? (l_data.expanded ? "-":"+") : "&nbsp";
	}


	function selectNode (id) {
		if (id == idSelected)
			return;
			
		hideContext();
		
		if (idEditing && (id == idEditing))
			return;
		
		editNodeNameChange();
		
		if (idSelected)
			data[idSelected].divName.className = "nodeName";
		
		idSelected = id;
		
		if (idSelected) {
			focusNode(idSelected);
			data[idSelected].divName.className = "nodeNameSelected";
			// call click function
			config.onClick(idSelected);
		}
	}

	function focusNode (id) {
		if (idEditing && (id == idEditing))
			return;
		
		if (idFocus && data[idFocus] && (idFocus != idSelected) && (idFocus != idEditing))
			data[idFocus].divName.className = "nodeName";
			
		idFocus = id;
		
		if ((idFocus) && (idFocus != idSelected))
			data[idFocus].divName.className = "nodeNameOver";
	}


	function expandNode (id, expand) {
		var l_data = data[id];

		if (expand) {
			if (!l_data.expanded && l_data.children.length) {
				// load children
				l_data.divChildren.className = "childNodes";
				l_data.plus.innerHTML = "O";

				// remember this
				saveExpanded(id, true);

				// make sure all the children are loaded
				async.each(l_data.children,
					function (child, cb) {
						if (data[child])
							// already loaded
							return cb();

						// let's load it
						loadNode(child, cb);
					},
					function (err) {
						if (err)
							return console.error(err);

						// all done
						l_data.expanded = true;
						l_data.plus.innerHTML = "-";
					});
			}
		}  else {
			// collapse
			if (l_data.expanded) {
				l_data.expanded = false;
				l_data.divChildren.className = "childNodesHidden";
				l_data.plus.innerHTML = "+";

				// remember this
				saveExpanded(id, false);
			} else {
				// already collpased.  We'll collapse parent cause this was likely a left key press (moving up the tree)
				expandNode(l_data.parentID, false);
				focusNode(l_data.parentID);
			}
		}
	}



	function deleteNode(id) {
		// select a next/previous node
		var l_next = getNextNode(id);
		if (l_next == null)
			l_next = getPreviousVisible(id);

		selectNode(l_next);
		
		// remove the child
		var l_div = data[id].div;
		l_div.parentNode.removeChild(l_div);

		var l_parentID = data[id].parentID;
		
		// forget the data (this should get all child objects)
		delete data[id];

		updatePlus(l_parentID);
	}





	/////////////////////////////////////////////////////
	//
	//	Context
	//

	var g_divContext = null;


	function showContext (id, p_data) {
		if (g_divContext == null) {
			g_divContext = document.createElement("div");
			g_divContext.className = "contextMenuBody";
			document.body.appendChild(g_divContext);
		}
		
		g_divContext.style.display = "block";
		g_divContext.innerHTML = "";
		
		var l_item;
		for (var i=0;i<p_data.length;i++) {
			l_item = document.createElement("div");
			g_divContext.appendChild(l_item);
			
			l_item.subs = p_data[i].subs;
			l_item.action = p_data[i].action;
			
			if (p_data[i].inline) // for icon lists etc
				l_item.style.cssFloat = "left";
			else
				l_item.style.clear = "both";
				
			l_item.className = "contextMenuItem";
			
			l_item.onmouseover = function () {
				this.className = "contextMenuItemOver";
			}
			
			l_item.onmouseout = function () {
				this.className = "contextMenuItem";
			}
			
			l_item.onmousedown = function(e) {
				if (this.subs) {
					showContext(id, this.subs);
				}

				if (this.action) {
					hideContext();
					// call script
					this.action(id);
				}
				
				var evt=fixe(e);
				evt.cancelBubble = true;
				return false;
			}
			
			var l_img = document.createElement("img");
			if (p_data[i].icon)
				l_img.src = config.iconPath + p_data[i].icon;
			else {
				l_img.src = "images/spacer.gif";
				l_img.width = 16;
			}
			
			l_item.appendChild(l_img);
			
//			if (p_data[i].uploadPath) {
//				l_item.innerHTML += '<input type="file" name="f" onclick="top.fTool.addUpload(this, \''+p_data[i].uploadPath+'\')" style="filter:alpha(opacity=0);zoom:1;opacity:0;position:absolute;width:70px;height:20px;cursor:pointer;" />'
//			}
			
			if (p_data[i].name)
				l_item.appendChild(document.createTextNode(p_data[i].name));
		}
		
		g_divContext.style.top = (g_mouseY - 5) +"px";
		g_divContext.style.left = (g_mouseX - 5) +"px";
		
		// is menu beyond left side? can we see it?
		if (g_mouseX + g_divContext.offsetWidth > document.body.offsetWidth) {
			g_divContext.style.left = (document.body.offsetWidth - g_divContext.offsetWidth) +"px";
		}
	}

	function hideContext() {
		if (g_divContext)
			g_divContext.style.display = "none";
	}



	////////////////////////////////////////
	//
	//	edit name
	//

	function editNodeName(id) {
		if (id != idEditing) {
			// in case we were already editing a different name
			//editNodeNameChange()
			
			if (typeof config.onRename == "function") {
				idEditing = id;
				
				var l_div = data[idEditing].divName;
				l_div.contentEditable = true;
				l_div.className = "nodeNameEdit";
				l_div.focus();
				return true;
			} else
				return false;
		}
		return false;
	}

	function editNodeNameChange() {
		if (idEditing) {
			var l_data = data[idEditing];
			
			l_data.divName.contentEditable = false;
			
			if (idEditing == idSelected)
				l_data.divName.className = "nodeNameSelected";
			else if (idEditing == idFocus)
				l_data.divName.className = "nodeNameOver";
			else
				l_data.divName.className = "nodeName";
			
			var l_strName = cleanName(l_data.divName.innerHTML);
			
			if (l_data.name != l_strName) {
				l_data.name = l_strName;
				l_data.divName.innerHTML = l_data.name;
				config.onRename(idEditing, l_data.name);
			}
			
			l_data.divName.blur();
			//document.body.focus()
			
			idEditing = null;
		}
	}


	function cleanName(p_str) {
		var l_str = p_str;
		
		// fix ampersands
		l_str = l_str.replace("&amp;", "&");
		// fix ampersands
		l_str = l_str.replace("&nbsp;", " ");
		// remove all tags
		l_str = l_str.replace(/<[\s\S]*?>/gim, "");
		// remove all line breaks and tabs
		l_str = l_str.replace(/[\r\n\t]+/g, " ");
		
		//l_str = l_str.replace(/^[\w ]+/g, "")
		
		return l_str;
	}


	///////////////////////////////////////////////////
	//
	//	Drag
	//

	var divDragging = null,
		divDropTarget = null,
		boolBefore = false,
		g_mouseX = 0,
		g_mouseY = 0,
		divDragWaiting = null;

	document.addEventListener("mouseup", endDrag);

	function endDrag() {
		// in case we haven't even started moving the div
		divDragWaiting = null;
		
		if (divDragging) {
			divDragging.style.left = 0;
			divDragging.style.top = 0;
			divDragging.style.position = "relative";
			
			if (divDropTarget) {
				var l_node = data[divDragging.id],
					l_nodeOldParent = data[l_node.parentID],
					l_target = data[divDropTarget.id],
					l_targetParent = data[l_target.parentID];
				
				if (boolBefore) {
					if (l_targetParent && l_nodeOldParent) {
						config.onDropBefore(l_node.id, l_target.id, l_nodeOldParent.id, function (err) {
							if (err)
								// problem server side.
								return console.error(err);

							// remove node from old parent's children
							l_nodeOldParent.divChildren.removeChild(l_node.div);
							l_nodeOldParent.children = _.without(l_nodeOldParent.children, l_node.id);

							// add it to new parent at proper index
							l_targetParent.divChildren.insertBefore(l_node.div, l_target.div);
							l_targetParent.children.splice(_.indexOf(l_targetParent.children, l_target.id), 0, l_node.id);

							// update node's parent id
							l_node.parentID = l_target.id;
						});
					}
				}
				else {
					if (l_targetParent) {
						config.onDrop(l_node.id, l_target.id, l_nodeOldParent.id, function (err) {
							if (err)
								// problem server side
								return console.error(err);

							// remove node from old parent's children
							l_nodeOldParent.divChildren.removeChild(l_node.div);
							l_nodeOldParent.children = _.without(l_nodeOldParent.children, l_node.id);

							// append it to new parent's children
							l_target.divChildren.appendChild(l_node.div);
							l_target.children.push(l_node.id);

							// update node parent id
							l_node.parentID = l_target.id;

							expandNode(l_node.parentID, true);
						});
					}
				}
				setDropTarget(null, false);
			}
			
			divDragging = null;
		}
	}


	document.addEventListener("mousemove", function(e) {
		var evt=fixe(e);

		g_mouseX = evt.pageX;
		g_mouseY = evt.pageY;
		
		if (divDragWaiting) {
			if (divDropTarget) {
				// start new drag
				divDragging = divDragWaiting;
				
				divDragWaiting = null;
				
				divDragging.mouseLeft = divDragging.offsetParent.offsetLeft - 5;
				divDragging.mouseTop = g_mouseY - divDragging.offsetTop;
			}
		}
	//	document.getElementById("status").innerHTML = g_mouseX +" "+ g_mouseY +"<br/>"
		
		if (divDragging) {
	//		document.getElementById("status").innerHTML += g_mouseY - divDragging.mouseTop
		
			divDragging.style.position = "absolute";
			divDragging.style.left = (g_mouseX  - divDragging.mouseLeft) + "px";
			divDragging.style.top = (g_mouseY - divDragging.mouseTop) + "px";
		}
	});


	function setDropTarget(p_div, p_before) {
		if (divDragging != p_div) {
			boolBefore = p_before;
			if (p_div != divDropTarget) {
				var l_data;
				if (divDropTarget) {
					l_data = data[divDropTarget.id];
					l_data.divDrop.className = "dropOff";
				}
				
				divDropTarget = p_div;
				
				if (divDropTarget) {
					l_data = data[divDropTarget.id];
					if (document.getElementById(l_data.parentID))
						// not root node
						l_data.divDrop.className = "dropOver";
				}
			}
			return true;
		} else
			return false;
	}




	///////////////////////////////////////////////////
	//
	//	Node traversal
	//

	function getNextNode(id) {
		if (data[id]) {
			var l_children,
				l_parent = data[data[id].parentID];

			if (l_parent) {
				l_children = l_parent.divChildren.childNodes;
			} else {
				l_children = divTree.childNodes;
			}
			
			var l_found = false;

			for (var i=0;i<l_children.length;i++) {
				if (l_found)
					return l_children[i].id;
				if (l_children[i].id == id)
					l_found = true;
			}
			return null;
		}
		return null;
	}

	function getPreviousNode(id) {
		if (data[id]) {
			var l_children,
				l_parent = data[data[id].parentID];

			if (l_parent) {
				l_children = l_parent.divChildren.childNodes;
			} else {
				l_children = divTree.childNodes;
			}
				
			var l_found = false;
			for (var i=l_children.length;i>0;i--) {
				if (l_found)
					return l_children[i-1].id;
				if (l_children[i-1].id == id)
					l_found = true;
			}
			return null;
		}
		return null;
	}



	function getNextVisible(id) {
		var l_data = data[id];
		
		if (l_data.expanded) {
			return l_data.children[0];
		}
		
		var l_next = getNextNode(id);
		if (l_next)
			return l_next;
		
		return findNextParent(l_data.parentID);
	}

	function findNextParent(id) {
		var l_next = getNextNode(id);
		if (l_next)
			return l_next;

		if (data[id])
			if (data[id].parentID)
				return findNextParent(data[id].parentID);
		
		return null;
	}


	function getPreviousVisible(id) {
		var l_previous;
		l_previous = getPreviousNode(id);

		if (l_previous) {
			return findLastChild (l_previous);
		}
		
		if (data[id])
			if (data[id].parentID)
				return data[id].parentID;
		
		return null;
	}

	function findLastChild(id) {
		if (data[id].expanded) {
			var l_arrChildren = data[id].divChildren.childNodes;
			return findLastChild(l_arrChildren[l_arrChildren.length - 1].id);
		} else {
			return id;
		}
	}


	function findParent(childID) {
		// should only be used rarely (long)
		for (var id in data) {
			if (_.includes(data[id].children, childID)) {
				return id;
			}
		}
		// no parent found
		return null;
	}


	function addChild(childID) {
		// adds child to parent in proper order
		var child = data[childID];

		// make sure we aren't root node
		if (child.parentID) {
			var parent = data[child.parentID],
				index = _.indexOf(parent.children, childID),
				nextSibling;

			while (index < parent.children.length) {
				index++;
				nextSibling = document.getElementById(parent.children[index]);
				if (nextSibling) {
					// found the next sibling
					parent.divChildren.insertBefore(child.div, nextSibling);
					return;
				}
			}

			// if we made it this far, we're last (or first)
			parent.divChildren.appendChild(child.div);
		} else {
			// root node
			divTree.appendChild(child.div);
		}
	}




	////////////////////////////////////////////////////
	//
	//	Utils
	//

	function fixe(e) {
		return (e ? e : window.event);
	}


	////////////////////////////////////////////////////
	//
	//	Local persistance
	//

	var persistance = {},
		storedString = localStorage[config.rootID];

	if (storedString) {
		persistance = JSON.parse(storedString);
	}
	
	if (!persistance.hasOwnProperty("expanded")) {
		persistance.expanded = [];
	}

	function loadExpanded(id) {
		return _.includes(persistance.expanded, id);
	}

	function saveExpanded(id, bool) {
		if (bool) {
			if (! _.includes(persistance.expanded, id))
				persistance.expanded.push(id);
		} else {
			persistance.expanded = _.without(persistance.expanded, id);
		}
		// save it
		localStorage[config.rootID] = JSON.stringify(persistance);
	}


	return {
		loadNode:loadNode,
		createNode:createNode,
		editNodeName:editNodeName,
		deleteNode:deleteNode,
		expandNode:expandNode,
		selectNode:selectNode
	}
};