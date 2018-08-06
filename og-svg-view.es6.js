Polymer({
    is: 'og-svg-view',
    properties: {
      /**
      * Src path of SVG
      *
      * @property svgSrc
      */     
     svgSrc:{
       type:String,
       observer:'_srcSVGUpdated'
     }
    },
    ready:function(){
        let mouseMoveHander = this._elementDrag.bind(this);
        this.$.svg.addEventListener('mousedown',(e)=>{this._dragMouseDown(e,mouseMoveHander,this)});
        window.addEventListener('mouseup',(e)=>{this._closeDragElement(e,mouseMoveHander,this)});
    },
    load:function(){

    },
    _dragMouseDown:function (e,mouseMoveHandler,self) {        
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        self.pos1 = {x:e.clientX,y:e.clientY};         
        self.$.svg.addEventListener('mousemove',mouseMoveHandler);                     
      },
     _elementDrag:function(e) {
       let elmnt = e.target;        
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position:
        let diffX = this.pos1.x - e.clientX;
        let diffY= this.pos1.y - e.clientY;
        
        this.pos1 = {x:e.clientX,y:e.clientY};   
        let t = (elmnt.style.marginTop)?parseInt(elmnt.style.marginTop):0;
        elmnt.style.marginTop = (t- diffY) + "px";        
      },
      _closeDragElement:function(e,mouseMoveHandler,self) {                  
        self.$.svg.removeEventListener('mousemove',mouseMoveHandler);  
      },
      
      _srcSVGUpdated:function(){
        this.$.svgAjax.url = this.svgSrc;        
        this.$.svgAjax.generateRequest();
         
      },      
      _svgAJAXResponse:function(event,req){
       let response = event.detail.response;
       this.$.svg.innerHTML = response;
      }

  });