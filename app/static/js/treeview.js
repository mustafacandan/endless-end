$(document).ready(function() {

     $.jstree.defaults.core.themes.variant = "large";
        var $treeview = $("#treeview");
        $treeview.jstree({
            "plugins" : [ 'contextmenu', 'types'],
            "core" : {
                "check_callback" : true,
                "types": {
                    "add": {
                        "icon": "fas fa-plus"
                    }
                },
                "data" : function (node, cb) {
                    $.ajax({
                    url: '/tree/get/'+bookId,
                    type: 'GET',
                    data: {
                        name: 'name'
                    },
                    success: function(result) {
                            console.log(result);
                            cb(result);
                    },
                });

                }


            },"contextmenu":{
                "items": function($node) {
                    var tree = $("#treeview").jstree(true);
                    return {
                        "Open": {
                            "separator_before": false,
                            "separator_after": true,
                            "label": "Open",
                            "icon":"far fa-trash-alt",
                            "action": function (data) {
                                var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                                window.location.href = '/book/Macera-Tuneli/pages/'+ obj.id;
                            }
                        },
                        "Create": {
                            "separator_before": false,
                            "separator_after": false,
                            "icon":"fas fa-project-diagram",
                            "label": "Create",
                            "action": function (obj) {
                                $node = tree.create_node($node);
                                tree.edit($node);
                            }
                        },
                        "Rename": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Rename",
                            "icon":'fas fa-signature',
                            "action": function (data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    inst.edit(obj);
                                console.log($('#'+obj.a_attr.id).val)

                            }
                        },
                        "Remove": {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Remove",
                            "icon":"far fa-trash-alt",
                            "action": function (obj) {
                                tree.delete_node($node);
                            }
                        }
                    };
                }
            }
            });
        // {#https://stackoverflow.com/questions/29563712/in-jstree-how-to-bring-a-specified-node-into-focus-on-a-large-tree#}

        $('#treeview').on('ready.jstree', function() {
            // {# Opens all the nodes #}
            $("#treeview").jstree("open_all");

        }).bind("rename_node.jstree", function (event, data) {
            // {# Saves the renamed path #}
            $.ajax({
                url: '/path/rename/'+data.node.id,
                type: 'POST',
                data: {
                    name: data.text
                },
                success: function(result) {
                    console.log(result)
                    quill.setContents([{ insert: '\n' }]);
                },
                });

        }).bind("create_node.jstree", function (event, data) {
             // {# Creates new node and refreshes the tree #}
             $.ajax({
                url: '/path/add/'+data.node.parent,
                type: 'POST',
                data: {
                'dummy':'data'
                },
                success: function(result) {
                        console.log(result.id);
                        $('#treeview').jstree(true).refresh();
                    },
                });

        }).bind("delete_node.jstree", function (event, data) {
            // {# Deletes the node #}
            $.ajax({
                url: '/path/delete/'+data.node.id,
                type: 'POST',
                data: {
                'dummy':'data'
                },
                success: function(result) {
                        console.log(result);
                    },
                });

        }).bind("open.jstree", function(evt, data){
                //selected node object: data.inst.get_json()[0];
                //selected node text: data.inst.get_json()[0].data
                window.location.href = '/book/Macera-Tuneli/edit/'+ data.node.id;
            }
        );
        // {# Activates the menu on mobile #}
        $("#treeview").on("taphold", ".jstree-anchor", function (e) {
            console.log(e)
        });


});