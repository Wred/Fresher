// our backbone.js "fixes"
require("./backboneFixes.js");

var _ = require("lodash"),
	async = require("async"),
	Tree = require("./tree.js"),
	publications = new (require("./models/publications.js")),
	pages = new (require("./models/pages.js")),
	structures = new (require("./models/structures.js"));


window.onload = function () {
	// AM: NOTE: Backbone:
	// I'm going to load the initial data in a second call.
	// Really don't like the idea of loading it inlined

	// load publications and structures
	async.parallel(
		[
		function (cb) { publications.cbFetch(cb); },
		function (cb) { structures.cbFetch(cb); }
		],
		function (err, results) {
			if (err)
				return console.error("Unable to read publications/structures: "+ err);

			// start with first publication (we'll change this one we get cookies going)
			loadContentTree(publications.at(0).get("rootPage"));
		});
}


function loadContentTree(rootPageID) {
	
	function contextNew(id, idStruct) {	
		var structure = structures.get(idStruct);
		
		// create page and save it on server
		pages.create(
			{
				name:structure.get("name"),
				image:structure.get("image"),
				children:[]
			},
			{
				wait: true, // only add once we get a response
				success:function (model, resp, options) {
					// now we can add the _id of the new page to the parent's children
					var parent = pages.get(id);
					var children = parent.get("children");
					children.push(model.get("_id"));
					parent.cbSave({children:children},
						function (err, response) {
							if (err)
								return console.error(err);

							// update parent (to update children)
							tree.createNode(parent.get("_id"), parent.get("name"), parent.get("image"), parent.get("children"));

							// add node
							tree.createNode(model.get("_id"), model.get("name"), model.get("image"), model.get("children"));

							// make sure parent is expanded
							tree.expandNode(parent.get("_id"), true);
							tree.selectNode(model.get("_id"));
						});
				},
				error:function (model, resp, options) {
					console.error("Couldn't create new page");
					console.error(resp);
				}
			});
	}

	var tree = Tree({
		domID:"tree",
		rootID:rootPageID,
		iconPath: "images/icons/",
		onLoad: function (id, cb) {
			pages.getOrFetch(id, {}, function (err, model) {
				if (err)
					return console.log("Couldn't load page: "+ id);

				cb(null, model.get("name"), model.get("image"), model.get("children"));
			});
		},
		onClick:function(id) {
			console.log("open page: "+ id);
		},
		onDrop:function(id, target_id, old_parent_id, cb) {
			var parent = pages.get(target_id),
				oldParent = pages.get(old_parent_id);

			// remove from old parent
			oldParent
				.cbSave({children:_.without(oldParent.get("children"), id)}, function (err) {
					if (err)
						return cb("Failed to save old parent: "+ err);

					// now add node to new parent
					var children = parent.get("children");
					children.push(id);

					parent
						.cbSave({children: children}, function (err) {
							if (err)
								return cb("Failed to save old parent:"+ err);

							// success - update tree
							cb();
						});
				});
		},
		onDropBefore:function(id, target_id, old_parent_id, cb) {
			console.log("moving: "+ id +"\n\tprevious:"+ target_id);

			var oldParent = pages.get(old_parent_id);

			// remove from old parent
			oldParent
				.cbSave({children:_.without(oldParent.get("children"), id)}, function (err) {
					if (err)
						return cb("Couldn't save old parent changes: "+ err);

					// add it to new parent
					// first find the parent
					var newParents = pages.filter(function (page) {
						return _.includes(page.get("children"), target_id);
					});

					// there should only be one new parent..
					if (newParents.length == 0) {
						console.error("No parent found for target.");
						// can't continue
						return;
					}

					if (newParents.length > 1) {
						console.error("Multiple parents found for target.");
					}

					var newParent = newParents[0],
						children = newParent.get("children");

					children.splice(_.indexOf(children, target_id), 0, id);

					newParent
						.cbSave({children:children}, function (err) {
							if (err)
								return cb("Failed to save old parent: "+ err);

							// success - update tree
							cb();
						});
				});
		},
		onRename:function(id, name) {
			pages.get(id).cbSave({name:name}, function (err, res) {
				if (err) {
					return console.error(err);
				}
			});
		},
		onContext:function(id, cb) {
			if (id) {
				// add structures to new context menu
				var subs = structures.map(function (structure) {
					return {
						name:structure.get("name"),
						icon:structure.get("image"),
						action: function (id) {
							contextNew(id, structure.get("_id"));
						}
					};
				});

				var l_return = [
					{name:'Rename', action:function (id) {
						tree.editNodeName(id);
					}},
					{name:'Preview', action:function (id) {
						console.log("Preview page: "+ id);
					}},
					{name:'Publish', action:function (id) {
						console.log("Publish page: "+ id);
					}},
					{name:'New...', subs:subs},
					{name:'Delete',action:function (id) {
						console.log("Delete page: "+ id);
						tree.deleteNode(id);
					}},
					{name:'Properties',action:function (id) {
						console.log("Page properties: "+ id);
					}}
				];

				return cb (null, l_return);
			}

			return cb(null, []);
		}
	});

}