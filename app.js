$(function(){
    
    window.Subtitle = Backbone.Model.extend({
        //attributes: {start:Num(milliseconds), end:Num(milliseconds), text:String}
        defaults: function() {  return { active: false }; }
    });
    
    window.ClockModel = Backbone.Model.extend({
        //attributes: clock:Timer instance, currentTime(set by updateTime, bound to clock)
        currentTime:0,
        
        initialize: function(){
            this.clock=new Timer(0);
            this.set('currentTime', 0);
            this.clock.bind('ticking', this.updateTime, this);
            _.bindAll(this, 'updateTime', 'play', 'pause');
        },
        
        updateTime: function(time){
            this.set('currentTime', time);
        },
        
        play: function() {
            this.clock.play();
        },
        
        pause: function(){
            this.clock.pause();
        }
    });
            
        
    window.SubtitleList = Backbone.Collection.extend({
        model:Subtitle,

        initialize: function() {
            _.bindAll(this, 'toDisplay');
        },
        
        //finds subtitles to display and returns the views
        toDisplay: function(time) {
            var lines = this.filter(function(subtitle){ return !subtitle.get('active') && time>= subtitle.get('start') && time <= subtitle.get('end'); });
            return _.map(lines,  function(line){ line.set('active', true); return new SubtitleView({model:line}); });
        },
        
        comparator: function(subtitle) {
            return subtitle.get('start');
        }
    });

    //itself is a <select> box
    //attributes: collection(SubtitleList instance)
    window.SubtitleListView = Backbone.View.extend({
        el:  "#sele",

        render: function() {
            var self=this;
            this.collection.each(function(line){
                $(self.el).append($('<option/>', {value:line.cid, text:line.get('text')}));
            });
        },
        
    });
    
   //a subtitle that is displayed
   //attributes: model(Subtitle (model) instance)
    window.SubtitleView = Backbone.View.extend({
        tagName:  "p",
        
        initialize: function() {
            _.bindAll(this, 'render', 'remove');
        },

        render: function() {
            $(this.el).text(this.model.get('text'));
            return this;
        },
        
        remove: function(clock) { //is bound to clock by Clockview when it is contructed
            var time=clock.get('currentTime');
            if(time > this.model.get('end'))  {
                clock.off('change:currentTime', this.remove, this);
                this.model.set('active', false);
                $(this.el).remove();
            }
        }
    });


    window.Subtitles = new SubtitleList(); //array of JSON subtitles in the form {'start': ..., 'end': ...., 'text': ...}

    //main app view
    //attributes: selector(SubtitleListView instance); clock(ClockModel instance)
    //assumes global Subtitles (SubtitleList)
    window.ClockView = Backbone.View.extend({
        el: '#clock',

        selector: new SubtitleListView({collection:Subtitles}),
        
        events: {
            'click #play' : 'play',
            'click #pause' : 'pause',
            'click #setCurrent': 'setCurrent'
        },
        
        initialize: function(c) {
            this.clock=c;
            this.clock.bind('change:currentTime', this.render, this);
            this.selector.render();
            _.bindAll(this, 'setCurrent', 'render', 'play', 'pause');
        },
        
        setCurrent: function () {
            this.pause();
            var current=Subtitles.getByCid(this.$('option:selected').prop('value'));
            current.set('active',true);
            var line= new SubtitleView({model:current});
            this.clock.bind('change:currentTime', line.remove);            
            this.$el.prepend(line.render().el);
	    var difference=current.get('start') - this.clock.get('currentTime');
            Subtitles.each(function(subtitle){
                subtitle.set('start', Math.max(0, subtitle.get('start')-difference));
                subtitle.set('end', Math.max(0, subtitle.get('end')-difference));
            });
            this.play();
            
        },
        
        play: function() {
            //window.setTimeout(this.clock.play, 3000);
            this.clock.play();
        },
        
        pause: function(){
            this.clock.pause();
        },
        
        render: function(time){
            if(!time){
                return this;
            }
            time=time.get('currentTime');
            this.$('#display').text(time);
            var self=this;
            _.each(Subtitles.toDisplay(time), function(view){
                self.clock.bind('change:currentTime', view.remove);
                self.$el.prepend(view.render().el);                
            });
            return this;
        },

    });
    
    window.Clock = new ClockModel;
    window.ClockDisplay = new ClockView(Clock);
    window.ClockDisplay.render();
});