var tree,
	publications = new Publications,
	pages = new Pages,
	structures = new Structures;

window.onload = function () {

	// AM: NOTE: Backbone:
	// I'm going to load the initial data in a second call.
	// Really don't like the idea of loading it inlined
	publications.fetch({
		success: function (collection, response, options) {

			function contextNew(id, p_struct) {	
				// create page and save it on server
				pages.create(
					{
						name:"New Page",
						image:"page.gif",
						children:[]
					},
					{
						wait: true, // only add once we get a response
						success:function (model, resp, options) {
							// now we can add the _id of the new page to the parent's children
							var parent = pages.get(id);
							var children = parent.get("children");
							children.push(model.id);
							parent.setSave("children", children, function (err, response) {
								if (err)
									return console.error(err);

								// update parent (to update children)
								tree.createNode(parent.id, _.clone(parent.attributes));

								// add node
								tree.createNode(model.id, _.clone(model.attributes));
							});
						},
						error:function (model, resp, options) {
							console.error("Couldn't create new page");
							console.error(resp);
						}
					});
			}

			tree = Tree({
				domID:"tree",
				// load first publication for now
				rootID:publications.at(0).get("rootPage"),
				iconPath: "images/icons/",
				onLoad: function (id, cb) {
					pages.getFetch(id, cb);
				},
				onClick:function(id) {
					console.log("open page: "+ id);
				},
				onDrop:function(id, target_id, old_parent_id) {

					return;
					
					var parent = pages.get(target_id),
						oldParent = pages.get(old_parent_id);

					// remove from old parent
					oldParent.set("children", _.without(oldParent.get("children"), id));

					// add it to new parent
					var children = parent.get("children");
					children.push(id);
					parent.set("children", children);

					pages.sync("update", pages, {
						success: function () {

						},
						error: function () {
							
						}
					});
				},
				onDropBefore:function(id, target_id, old_parent_id) {
					console.log("moving: "+ id +"\n\tprevious:"+ target_id);

					return;

					var oldParent = pages.get(old_parent_id);
						
					// remove from old parent
					oldParent.set("children", _.without(oldParent.get("children"), id));

					// add it to new parent
					// first find the parent
					var newParents = pages.filter(function (page) {
						return _.contains(page.get("children"), target_id);
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
					newParent.set("children", children);


					pages.sync("update", pages, {
						success: function () {

						},
						error: function () {
							
						}
					});
				},
				onRename:function(id, name) {
					pages.get(id).setSave("name", name, function (err, res) {
						if (err) {
							return console.error(err);
						}
					});
				},
				onContext:function(id, cb) {
					if (id) {
						var l_return = [
							{name:'Rename', action:function (id) {
								tree.renameNode(id);
							}},
							{name:'Preview', action:function (id) {
								console.log("Preview page: "+ id);
							}},
							{name:'Publish', action:function (id) {
								console.log("Publish page: "+ id);
							}},
							{name:'New...', subs:[
								{name:'Home',icon:'icon_home.gif',action:function (id) {contextNew(id, 1)}}
								]
							},
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

		},
		error: function (collection, response, options) {
			console.error("Unable to load publications:\n"+ response);
		}
	});

}