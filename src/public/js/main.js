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
				var page = pages.create(
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

								// reload parent
								tree.readNodeData(_.clone(parent.attributes));
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
				onDrop:function(id,target_id) {
					// new parent
					console.log("reparenting: "+ id +"\n\tparent: "+ target_id); 
				},
				onDropBefore:function(id, target_id) {
					console.log("moving: "+ id +"\n\tprevious:"+ target_id);
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