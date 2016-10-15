var config = {
    apiKey: "AIzaSyBz5IgqyTM0ltgXqEymjDDtz53nQxF85CM",
    authDomain: "web-demo-8b956.firebaseapp.com",
    databaseURL: "https://web-demo-8b956.firebaseio.com",
    storageBucket: "web-demo-8b956.appspot.com",
    messagingSenderId: "983297345772"
  };
var firebaseApp=firebase.initializeApp(config);
var db = firebaseApp.database();
Vue.config.devtools = true;
var canvas = this.__canvas = new fabric.Canvas('canvas');
fabric.Object.prototype.transparentCorners = false;

new Vue({
  el: '#app',
  data: {
        canvas:{

        },
        active:false,
        enregistrer:false,
        encours:false,
        delete:false,
        b:[],
 
    
  },
  firebase: {
    canva_db: db.ref('canvas')
  },
  methods:{
    AddTriagle:function(){//l'ajoute de triangle lorsque on clique sur le button ajouter triangle
       var triangle = new fabric.Triangle({
          width: 100, height: 100, left: 50, top: 300, fill: '#cca'
        });
       this.canvas.add(triangle);
       this.canvasOn();

    },
    AddCircle:function(){//l'ajoute de circle lorsque on clique sur le button ajouter circle
      var circle = new fabric.Circle({
        radius: 50, left: 275, top: 75, fill: '#aac'
      });
      this.canvas.add(circle);
      this.canvasOn();

    },
    AddSquare:function(){//l'ajoute de carre lorsque on clique sur le button ajouter rectangle
      var rect = new fabric.Rect({
            top : 100,
            left : 100,
            width : 60,
            height : 70,
            fill : 'red'
        });
 
        this.canvas.add(rect);
        this.canvasOn();

    },
    canvasOn:function(){//attacher les evenements de gestion a chaque object cree dans le canvas
      this.canvas.on({
          'object:moving': this.onChange,
          'object:scaling': this.onChange,
          'object:rotating': this.onChange,
          'object:selected': this.onSelect,
        });
      this.AddToJSON(); //stocker l'etat des objects dans le BD
    },
    onChange:function(options){
      self=this;
      options.target.setCoords();
      this.canvas.forEachObject(function(obj) { 
      if (obj === options.target) return;
      obj.setOpacity(options.target.intersectsWithObject(obj) ? 0.5 : 1);
    });
      this.enregistrer=true;//active le button d'enregistrer

    },
    AddToJSON:function(){
      self=this;
      this.$firebaseRefs.canva_db.remove();
      this.canvas.forEachObject(function(obj) {
      self.$firebaseRefs.canva_db.push(JSON.parse(JSON.stringify(obj)),function(error){

              if(!error)
              {
                if(self.delete){
                  self.delete=false;
                  self.active=false;
                }
                self.encours=false;
              }

        });

        });

      this.enregistrer=true;
    },
    saveChange:function(element){
      
      this.encours=true;
      this.UpdateJsonFile(element,this.a);

    },
    onSelect:function(){
      if(this.canvas.getActiveObject()){
        this.active=true;
      }else{
        this.active=false;
      }
    },
    onDelete:function(){
      this.encours=true;
      if(this.canvas.getActiveObject()){
        this.canvas.remove(this.canvas.getActiveObject());
      }
       
        this.delete=true;
        this.saveChange('delete');  

    },
    clickCheck:function(){
        this.onSelect();
    },
    Switch:function(element){
      switch(element.type) {
        case 'rect':
            this.CreatRect(element)
            break;
        case 'circle':
            this.CreatCircle(element)
            break;  
        case 'triangle':
            this.CreatTriangle(element)
            break;  
      }   
    },
    CreatRect:function(element){//fonction pour cree un rectangle a l'etat initial
      var rect = new fabric.Rect({
            top : element.top,
            left : element.left,
            width : element.width,
            height : element.height,
            fill : element.fill,
            scaleX:element.scaleX,
            scaleY:element.scaleY,
            angle:element.angle
        });
 
        this.canvas.add(rect);
        this.canvasOn();


    },
    CreatCircle:function(element){//fonction pour cree une circle a l'etat initial
        
      var circle = new fabric.Circle({
          radius:element.radius,
          left: element.left, 
          top: element.top, 
          fill: element.fill,
          scaleX:element.scaleX,
          scaleY:element.scaleY,
          angle:element.angle
        });
      this.canvas.add(circle);
      this.canvasOn();

    },
    CreatTriangle:function(element){//fonction pour cree un triangle a l'etat initial
      var triangle = new fabric.Triangle({
          width: element.width, 
          height: element.height, 
          left: element.left, 
          top: element.top,
          fill: element.fill,
          scaleX:element.scaleX,
          scaleY:element.scaleY,
          angle:element.angle
        });
       this.canvas.add(triangle);
       this.canvasOn();
    },
    UpdateJsonFile:function(uid,element){
              
      this.AddToJSON();   
    } 
  },
  ready:function(){
    self=this;
     this.$firebaseRefs.canva_db.once("value", function(snapshot) {
        for (var x in snapshot.val()) {
            var xRef = firebaseApp.database().ref("canvas/"+x);
            xRef.once("value", function(xsnapshot) {
                self.b.push(xsnapshot.val());
                
            });        
        } 
        self.b.forEach( function (element)
                  {
                    self.Switch(element);    
                  });
      })

    document.addEventListener("click",this.clickCheck);
    this.canvas=canvas;  
  }
});