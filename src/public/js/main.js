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
				console.log("New page of type: "+ p_struct);
				// top.fTool.call('processCB.asp', "Creating page...", {c:"PAGENEW", p:g_data[id].pageID, s:p_struct}, function (p_id) {
				// 	loadNode("contenttreedata.asp?p=" + id);
				// })
			}

			tree = Tree({
				domID:"tree",
				// load first publication for now
				rootID:publications.at(0).get("rootPage"),
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

					return cb(null, null);
				}
			});

		},
		error: function (collection, response, options) {
			console.error("Unable to load publications:\n"+ response);
		}
	});

}