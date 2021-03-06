Polymer({
    is: 'og-svg-view',
    behaviors: [
        Polymer.IronResizableBehavior
    ],
    listeners: {
    'iron-resize': '_onIronResize'
    },
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
     svgIdPrefix:{
        type:String,
        value:function(){return this.is;}
     },
     svgProps:{
        type:Object,
        value:{}
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
        value:[],
        observer:'_bindSVGElements'
     },
     svgDisplayMode:{
         type:String,
         value:'H'
     }
    },
    ready:function(){           
    },
    reflow:function(){            
        let svg = this.$.svg.children[0];
        let parent = this.$.svg.parentElement;
        if(!svg){
            console.log('reflow');    
            return;//svg is not loaded            
        }
        console.log('reflow after svg load');    
        this.svgProps.width = svg.width.baseVal.value;
        this.svgProps.height = svg.height.baseVal.value;
        this.svgProps.whRatio = svg.width.baseVal.value/svg.height.baseVal.value;

        let containerRatio = parent.clientWidth/(parent.clientHeight-this.$["watch-list-wrapper"].clientHeight);       
        if(containerRatio<this.svgProps.whRatio){
            if(this.svgDisplayMode!='V'){
                this.svgDisplayMode='V';      
                this.$.svg.classList.add("svg-v");
                this.$.svg.classList.remove("svg-h");
                this.$.svg.style.marginTop ='0px'; 
            }                                       
            //handle margin max
            let tx = (this.$.svg.style.marginLeft)?parseInt(this.$.svg.style.marginLeft):0;            
            let sizeDiff = Math.abs(this.$.svg.children[0].clientWidth - parent.clientWidth);            
            if(Math.abs(tx)>sizeDiff){
                this.$.svg.style.marginLeft =(sizeDiff * -1)+'px';
            } 
        }else{
            if(this.svgDisplayMode !='H'){
                this.svgDisplayMode='H';      
                this.$.svg.classList.add("svg-h");
                this.$.svg.classList.remove("svg-v"); 
                this.$.svg.style.marginLeft ='0px';   
            }                  
            //handle margin max
            let ty = (this.$.svg.style.marginTop)?parseInt(this.$.svg.style.marginTop):0;            
            let sizeDiff = Math.abs(this.$.svg.clientHeight +this.$["watch-list-wrapper"].clientHeight - parent.clientHeight);
            if(Math.abs(ty)>sizeDiff){
                this.$.svg.style.marginTop =(sizeDiff * -1)+'px';
            }                
        }
    },         
      _srcSVGUpdated:function(){
        this.$.svgAjax.url = this.svgSrc;        
        this.$.svgAjax.generateRequest();        
      },      
      _svgAJAXResponse:function(event,req){
       let response = event.detail.response;
       if(this.svgIdPrefix){
        let fixedIdSvg = this.renameIDs(response);
        this.$.svg.innerHTML = fixedIdSvg;   
       }else{
        this.$.svg.innerHTML = response;   
       }
       this.scopeSubtree(this.$.svg, true);           
       this._bindSVGElements();
       this.reflow();
       this.fire("svg-loaded");
      },
      _bindSVGElements:function(){
        if(!this.activeElements) return;
        this.activeElements.forEach(r => {            
            let elList =this.$.svg.querySelectorAll('#'+this.svgIdPrefix+'-'+r.id);
            if(elList.length==0){
                console.log('Error :cannot find elements for the id '+r.id);
                return;
            }
            if(elList && elList.length>1){
                console.log('Error : multiple elements with same id for the id '+r.id);
                return;
            }
            let el = elList[0];
            el.addEventListener('tap',r.listner);
            el.classList.add(r.class);
        });
      },
      swapVisibility:function(id){
        let elList =this.$.svg.querySelectorAll('#'+this.svgIdPrefix+"-"+id);
        if(elList.length==0){
            console.log('Error :cannot find elements for the id '+id);
            return;
        }
        if(elList && elList.length>1){
            console.log('Error : multiple elements with same id for the id '+id);
            return;
        }
        let el = elList[0]; 
        if(el.getAttribute('visibility')=='hidden' ||  el.classList.contains('hidden')){
            this.showHideElement(el,true);
        }else{
            this.showHideElement(el,false);
        }
      },
      showHideElement:function(id,show){
        let elList =this.$.svg.querySelectorAll('#'+this.svgIdPrefix+"-"+id);
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
            el.setAttribute('visibility','visible');
            el.classList.remove('hidden');
        }else{
            el.setAttribute('visibility','hidden');
            el.classList.add('hidden');
        }          
      },
      renameIDs:function(svgStr){
        var regex = /id="([A-Za-z]+[\w\-\:\.]*)"/gi;    
        var regexRef =/xlink:href="#([A-Za-z]+[\w\-\:\.]*)"/gi;            
        let fixedIdSVG = svgStr.replace(regex,"id=\""+this.svgIdPrefix+"-$1\"");
        return fixedIdSVG.replace(regexRef,"xlink:href=\"#"+this.svgIdPrefix+"-$1\"");
      },
      getElementById:function(id){
        return this.$.svg.querySelector('#'+this.svgIdPrefix+'-'+id);
      },
      _onIronResize: function(evt) {
        this.debounce('resize', this.reflow, 100);
      }

  });