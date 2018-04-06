odoo.define('dn_base.kanban_view', function (require) {
    "use strict";
    var core = require('web.core');
    var Model = require('web.DataModel');
    var KanbanView = core.view_registry.get('kanban');

    KanbanView.include({
        postprocess_m2m_tags: function(records) {
            var self = this;
            if (!this.many2manys.length) {
                return;
            }
            var relations = {};
            records = records ? (records instanceof Array ? records : [records]) :
                      this.grouped ? Array.prototype.concat.apply([], _.pluck(this.widgets, 'records')) :
                      this.widgets;

            records.forEach(function(record) {
                self.many2manys.forEach(function(name) {
                    var field = record.record[name];
                    var $el = record.$('.oe_form_field.o_form_field_many2manytags[name=' + name + ']');
                    if (! $el[0]) {
                        return;
                    }
                    if (!relations[field.relation]) {
                        relations[field.relation] = { ids: [], elements: {}, context: self.m2m_context[name]};
                    }
                    var rel = relations[field.relation];
                    field.raw_value.forEach(function(id) {
                        rel.ids.push(id);
                        if (!rel.elements[id]) {
                            rel.elements[id] = [];
                        }
                        rel.elements[id].push($el[0]);
                    });
                });
            });

           _.each(relations, function(rel, rel_name) {
                var myModel = new Model(rel_name);
                var read_fields=['name','id','image','photo']
                myModel.query(read_fields).filter([['id', 'in', rel.ids]]).all()
                .then(function(results) {
                    results.forEach(function(record) {
                        var title = 'No Name';
                        if(record.name)
                            title = record.name;
                        var image_source = dn_base_web_url+'?model=res.users&field=image_small&id=1';
                        if(record.image)
                            image_source = 'data:image/png;base64,'+record.image;
                        else if(record.photo)
                            image_source = 'data:image/png;base64,'+record.image;
                        var $tag = '<img src="'+image_source+'" title="'+title+'" />';
                        $(rel.elements[record.id]).append($tag);
                    });
                });
            });
        }
    });
    return KanbanView;
});