function Tree(config) {
	
	var idSelected = null,
		idFocus = null,
		idEditing = null,
		divTree = document.getElementById(config.domID),
		data = {};

	// load root node
	loadNode(config.rootID);

	document.onselectstart = function (e) {
		return checkEdit();
	};

	document.onmousedown = function (e) {
		return checkEdit();
	};

	document.oncontextmenu = function(e) {
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
	}

	function checkEdit() {
		if (idEditing) {
	//		editNodeNameChange(null)
			return true;
		}
		
		hideContext();
		return false;
	}


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
					l_id = getNextVisible(idFocus);
					if (l_id)
						focusNode(l_id);
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
				
	//		default:
	//			alert (keyCode)
		}
	}



	function loadNode(id) {
		config.onLoad(id, readNodeData);
	}



	function readNodeData(p_data) {	
		var l_dataFirstNode = null;

		if (l_dataFirstNode == null)
			l_dataFirstNode = p_data._id;
		
		createNode(p_data._id, p_data);
		
		// bit of a hack...
		if (l_dataFirstNode) {
			expandNode(l_dataFirstNode, true);
			// and now load the page
			selectNode(l_dataFirstNode);
		} else {
			alert ("No data returned");
		}
	}

	function createNode(id, p_data) {
		
		var l_data;
		
		if (data[id]) {
			l_data = data[id];
		} else {
			l_data = new Object();
			// store it
			data[id] = l_data;
		}
		
		// copy p_data into l_data
		for (var l_prop in p_data)
			l_data[l_prop] = p_data[l_prop];
		
		if (l_data.div) {
			// node already exists
	//		l_data.div.parentNode.removeChild(l_data.div)
			
			// update name
			l_data.divName.innerHTML = l_data.name;
			
			// udpate image
			l_data.img.setAttribute("src", config.iconPath + l_data.image);

			// should check to see if we have proper parent...
			
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
			
			// too lazy to fix this so we'll store parent id
			l_data.parentID = findParent(id);

			// show div
			// does parent exist?
			if (document.getElementById(l_data.parentID)) {
				// must be child node
				data[l_data.parentID].divChildren.appendChild(l_data.div);
			} else {
				// must be root node
				divTree.appendChild(l_div);
			}
			
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
			if (l_data.children.length) {
				// add interactivity
				l_plus.onmousedown = function(e) {
					expandNode(this.idNode, !data[this.idNode].expanded);
					var evt=fixe(e);
					evt.cancelBubble = true;
					return false;
				}
				
				if (l_data.children.length == 0)
					// hide children for now
					l_plus.innerHTML = "&nbsp;";
				else
					l_plus.innerHTML = "<em>+</em>";
			}
			else
				// shouldn't respond
				l_plus.innerHTML = "&nbsp;";
			
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
			
			// select this one if no node is selected
	//		if (idSelected == null)
	//			selectNode(id)
		}
		
		
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


	function expandNode (id, shouldLoad) {
		var l_data = data[id];
		
		if (l_data.loaded) {
			if (l_data.divChildren.childNodes.length) {
				l_data.expanded = p_bool;
				expandNodeRecurse(id, p_bool);
			} else {
				l_data.plus.innerHTML = "&nbsp;";
			}
		} else {
			if (shouldLoad && (l_data.children.length)) {
				// load data
				l_data.divChildren.className = "childNodes";
				l_data.plus.innerHTML = "O";
				
				for (var i=0;i<l_data.children.length;i++) {
					loadNode(l_data.children[i]);
				}
			}
		}
	}

	function expandNodeRecurse (id, p_bool) {
		var l_data = data[id];
		
		if (!l_data.loaded)
			return;
			
		var l_recurse = true;
		var l_numChildren = l_data.divChildren.childNodes.length;
		
		if (p_bool) {
			if (l_data.expanded) {
				l_data.divChildren.className = "childNodes";
				l_data.plus.innerHTML = "-";
			} else {
				l_recurse = false;
			}
		} else {
			if (l_numChildren) {
				l_data.divChildren.className = "childNodesHidden";
				l_data.plus.innerHTML = "+";
			}
		}
		
		if (l_recurse)
			for (var i=0;i<l_numChildren;i++)
				expandNodeRecurse(l_data.divChildren.childNodes[i].id, p_bool);

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
		
		// forget the data (this should get all child objects)
		delete data[id];
	}





	function swapNodeID(idOld, idNew) {
		data[idNew] = data[idOld];
		data[idOld] = null;
		
		data[idNew].id = idNew;
		data[idNew].div.id = idNew;
		
		if (idSelected == idOld)
			idSelected = idNew;
			
		if (idFocus == idOld)
			idFocus = idNew;
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

	document.onmouseup = endDrag;

	function endDrag() {
		// in case we haven't even started moving the div
		divDragWaiting = null;
		
		if (divDragging) {
			divDragging.style.left = 0;
			divDragging.style.top = 0;
			divDragging.style.position = "relative";
			
			if (divDropTarget) {
				var l_div = data[divDragging.id];
				var l_divParent = data[l_div.parentID];
				
				var l_target = data[divDropTarget.id];
				
				if (boolBefore) {
					var l_targetParent = data[l_target.parentID];
					
					if ((l_targetParent) && (l_divParent)) {
						config.onDropBefore(divDragging.id, divDropTarget.id);
						//eval(l_div.dropBefore +"('"+ l_div.id +"','"+ l_target.id +"')")

						l_divParent.divChildren.removeChild(l_div.div);
						l_targetParent.divChildren.insertBefore(l_div.div, l_target.div);
						
						l_div.parentID = l_targetParent.id;
					}
				}
				else {
					if (l_divParent) {
						config.onDrop(divDragging.id, divDropTarget.id);
						
						//eval(l_div.dropOn +"('"+ l_div.id +"','"+ l_target.id +"')")

						l_divParent.divChildren.removeChild(l_div.div);
						l_target.divChildren.appendChild(l_div.div);
						
						l_div.parentID = l_target.id;
						
						expandNode(l_div.parentID, true);
					}
				}
				setDropTarget(null, false);
			}
			
			divDragging = null;
		}
	}

	document.onmousemove = function(e) {
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
	}


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
			return l_data.divChildren.childNodes[0].id;
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
			if (_.indexOf(data[id].children, childID) > -1) {
				return id;
			}
		}
		// no parent found
		return null;
	}






	////////////////////////////////////////////////////
	//
	//	Utils
	//



	function fixe(e) {
		return (e ? e : window.event);
	}

	return {
		loadNode:loadNode,
		readNodeData:readNodeData,
		renameNode:editNodeName,
		deleteNode:deleteNode
	}
};