var tree,
	publications;

window.onload = function () {

	publications = new Publications();
	
	// load publications first
	publications.load(function () {
		
		// publications.items has all the publications

		function contextNew(id, p_struct) {	
			console.log("New page of type: "+ p_struct);
			// top.fTool.call('processCB.asp', "Creating page...", {c:"PAGENEW", p:g_data[id].pageID, s:p_struct}, function (p_id) {
			// 	loadNode("contenttreedata.asp?p=" + id);
			// })
		}
		
		tree = Tree({
			div:document.getElementById("tree"),
			// load first publication for now
			rootID:publications.items[0].rootPage,
			onLoad:function (id, cb) {
					$.ajax({
						url:"/rest/page/" + id,
						complete:function (data) {
							cb(data.responseJSON.payload);
						}
					});
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
				console.log("renaming: "+ id +"\n\tname: "+ escape(name));
				$.ajax({
					type:"PUT",
					url:"/rest/page/" + id,
					contentType : 'application/json',
					dataType:"JSON",
					data:JSON.stringify({name:name}),
					complete:function (xhr) {
						console.log(xhr.responseJSON.payload);
					}
				})
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
	});
}