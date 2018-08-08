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
     },
     /**
      * Elements to bind with on click action
      * eg : {id:'pad-1-well',listner:(()=>{alert('clicked')}),class:'active-el'}
      * id:elements id in SVG
      * listner: call back method to be triggered on click event
      * class : style class to be applied on element
      * 
      * @property activeElements
      */
     activeElements:{
        type:Array,
        value:[{id:'pad-1-well',listner:(()=>{alert('clicked')}),class:'active-el'}],
        observer:'_bindSVGElements'
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
       let elmnt = this.$.svg;        
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
       this._bindSVGElements();
      },
      _bindSVGElements:function(){
        this.activeElements.forEach(r => {            
            let elList =this.$.svg.querySelectorAll('#'+r.id);
            if(elList.length==0){
                console.log('Error :cannot find elements for the id '+r.id);
                return;
            }
            if(elList && elList.length>1){
                console.log('Error : multiple elements with same id for the id '+r.id);
                return;
            }
            let el = elList[0];
            el.addEventListener('click',r.listner);
            el.classList.add(r.class);
        });
      },
      showHideElement:function(id,show){
        let elList =this.$.svg.querySelectorAll('#'+id);
        if(elList.length==0){
            console.log('Error :cannot find elements for the id '+id);
            return;
        }
        if(elList && elList.length>1){
            console.log('Error : multiple elements with same id for the id '+id);
            return;
        }
        let el = elList[0]; 
        if(show) {
            el.classList.remove('hidden');
        }else{
            el.classList.add('hidden');
        }          
      }

  });