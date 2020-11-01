enum BLOCK_TYPE{STARTER=0,LOG,END,CAST,ADD_N,FOR,MUL_N};
enum CONNECTION_TYPE{FLOW=0,STRING,BOOLEAN,NUMBER,DATA,CHOICE};
interface IONode {
    type:number;
    value?:any;
    IO:Array<number[]>;
    choices?:object;
}
class Block{
  BLOCK_EXECUTORS=[
     async function(id){//Start
       Block.blocks[Block.blocks[id].output[0].IO[0][0]].execute(Block.blocks[id].output[0].IO[0][0],Block.blocks[id].output[0].IO[0][1]);
     },
     async function(id){//Log
       //console.log(Block.blocks[id].input[1].value);
       EventCatcher.Log(Block.blocks[id].input[1].value);
       Block.blocks[Block.blocks[id].output[0].IO[0][0]].execute(Block.blocks[id].output[0].IO[0][0],Block.blocks[id].output[0].IO[0][1]);
     },
     async function(id){//End
       EventCatcher.ProgramTermination();
     },
     async function(id){//Cast
       let val=Block.blocks[id].input[2].choices[Block.blocks[id].input[2].value];
       switch(val){
         case CONNECTION_TYPE.STRING:
          Block.blocks[id].output[1].value=Block.blocks[id].input[1].value+"";
         break;
         case CONNECTION_TYPE.BOOLEAN:
          Block.blocks[id].output[1].value=(Block.blocks[id].input[1].value)?(true):(false);
          break;
          case CONNECTION_TYPE.NUMBER:
           Block.blocks[id].output[1].value=Number(Block.blocks[id].input[1].value);
          break;
       }
       Block.blocks[id].send();
       Block.blocks[Block.blocks[id].output[0].IO[0][0]].execute(Block.blocks[id].output[0].IO[0][0],Block.blocks[id].output[0].IO[0][1]);
     },
     async function(id){//Add Numbers
       let ins:[]=Block.blocks[id].input.slice(1);
       let sum:number=0;
       ins.forEach((a:IONode)=>{
         sum+=a.value;
       });
       Block.blocks[id].output[1].value=sum;
       Block.blocks[id].send();
       Block.blocks[Block.blocks[id].output[0].IO[0][0]].execute(Block.blocks[id].output[0].IO[0][0],Block.blocks[id].output[0].IO[0][1]);
     },
     async function(id,port:number){//for loop
       switch(port){
         case 1:
          Block.blocks[id].output[1].value=0;
          Block.blocks[id].send();
          Block.blocks[Block.blocks[id].output[0].IO[0][0]].execute(Block.blocks[id].output[0].IO[0][0],Block.blocks[id].output[0].IO[0][1]);
         break;
         case 0:
          Block.blocks[id].output[1].value++;
          if(Block.blocks[id].output[1].value>=Block.blocks[id].input[2].value){
            Block.blocks[id].send();
            Block.blocks[Block.blocks[id].output[2].IO[0][0]].execute(Block.blocks[id].output[2].IO[0][0],Block.blocks[id].output[2].IO[0][1]);
          }else{
            Block.blocks[id].send();
            Block.blocks[Block.blocks[id].output[0].IO[0][0]].execute(Block.blocks[id].output[0].IO[0][0],Block.blocks[id].output[0].IO[0][1]);
          }
         break;

       }

     },
     async function(id){//Add Numbers
       let ins:[]=Block.blocks[id].input.slice(1);
       let sum:number=1;
       ins.forEach((a:IONode)=>{
         sum*=a.value;
       });
       Block.blocks[id].output[1].value=sum;
       Block.blocks[id].send();
       Block.blocks[Block.blocks[id].output[0].IO[0][0]].execute(Block.blocks[id].output[0].IO[0][0],Block.blocks[id].output[0].IO[0][1]);
     }
  ];
  BLOCK_SETUP=[
    ()=>{//start
      this.output.push({type:CONNECTION_TYPE.FLOW,value:null,IO:[]});
      return this;
    },
    ()=>{//log
      this.input.push({type:CONNECTION_TYPE.FLOW,value:null,IO:[]});
      this.input.push({type:CONNECTION_TYPE.STRING,value:null,IO:[]});
      this.output.push({type:CONNECTION_TYPE.FLOW,value:null,IO:[]});
      return this;
    },
    ()=>{//end
      this.input.push({type:CONNECTION_TYPE.FLOW,value:null,IO:[]});
      return this;
    },
    ()=>{//CAST
      this.input.push({type:CONNECTION_TYPE.FLOW,value:null,IO:[]});
      this.input.push({type:CONNECTION_TYPE.DATA,value:null,IO:[]});
      this.input.push({type:CONNECTION_TYPE.CHOICE,value:"String",IO:[],choices:{String:1,Boolean:2,Number:3}});
      this.output.push({type:CONNECTION_TYPE.FLOW,value:null,IO:[]});
      this.output.push({type:CONNECTION_TYPE.DATA,value:null,IO:[]});
      return this;
    },
    ()=>{//add
      this.input.push({type:CONNECTION_TYPE.FLOW,IO:[]});
      this.input.push({type:CONNECTION_TYPE.NUMBER,value:0,IO:[]});
      this.input.push({type:CONNECTION_TYPE.NUMBER,value:0,IO:[]});
      this.output.push({type:CONNECTION_TYPE.FLOW,IO:[]});
      this.output.push({type:CONNECTION_TYPE.NUMBER,value:0,IO:[]});
      return this;
    },
    ()=>{//for
      this.input.push({type:CONNECTION_TYPE.FLOW,IO:[]});//loop end
      this.input.push({type:CONNECTION_TYPE.FLOW,IO:[]});//inflow
      this.input.push({type:CONNECTION_TYPE.NUMBER,value:1,IO:[]});//Loop repeat count
      this.output.push({type:CONNECTION_TYPE.FLOW,IO:[]});//loop
      this.output.push({type:CONNECTION_TYPE.NUMBER,value:0,IO:[]});//loop Nr.
      this.output.push({type:CONNECTION_TYPE.FLOW,IO:[]});//continue
      return this;
    },
    ()=>{//multiply
      this.input.push({type:CONNECTION_TYPE.FLOW,IO:[]});
      this.input.push({type:CONNECTION_TYPE.NUMBER,value:1,IO:[]});
      this.input.push({type:CONNECTION_TYPE.NUMBER,value:1,IO:[]});
      this.output.push({type:CONNECTION_TYPE.FLOW,IO:[]});
      this.output.push({type:CONNECTION_TYPE.NUMBER,value:0,IO:[]});
      return this;
    },
  ];
  constructor(type:number){
    this.execute=this.BLOCK_EXECUTORS[type];

    if(isNaN(Block.blockDeclared))Block.blockDeclared=0;
    Block.blocks[Block.blockDeclared]=this.BLOCK_SETUP[type]();
    this.id=Block.blockDeclared;
    this.type=type;
    Block.blockDeclared++;

  }
  type:number;
  static blocks={};
  static blockDeclared:number;
  id:number;
  input:Array<IONode>=[];//type, value, enteringNodeId
  output:Array<IONode>=[];//type, value, exitingNodeIds
  execute():any{
    EventCatcher.NullBlockError();
  };
  static addConnection(from:[number,number],to:[number,number]){//[id,port]
    let fromType:number=Block.blocks[from[0]].output[from[1]].type;
    let toType:number=Block.blocks[to[0]].input[to[1]].type;
    //if(!=)throw `ConnectionError:output type ${Block.blocks[from[0]].output[from[1]].type} is not compatible with input type ${Block.blocks[to[0]].input[to[1]].type}`;
    if(
      ((fromType==toType || fromType==CONNECTION_TYPE.DATA || toType==CONNECTION_TYPE.DATA || toType==CONNECTION_TYPE.STRING) && fromType!=CONNECTION_TYPE.FLOW)
    ){
      Block.blocks[from[0]].output[from[1]].IO.push(to);
      Block.blocks[to[0]].input[to[1]].IO=from;
      return true;
    }else{
      if(fromType==toType){
        Block.blocks[from[0]].output[from[1]].IO[0]=to;
        Block.blocks[to[0]].input[to[1]].IO=from;
      }else{
        EventCatcher.AutoCastError();
      }
    }
  }
  static setParameter(id:number,index:number,value:any):void{
    Block.blocks[id].input[index].value=value;
  }
  send(){
    this.output.forEach((a) => {
      if(a.type!=CONNECTION_TYPE.FLOW){
        a.IO.forEach((b) => {
          if(Block.blocks[b[0]].input[b[1]].type==CONNECTION_TYPE.STRING){
            Block.blocks[b[0]].input[b[1]].value=a.value+"";
          }else{
            Block.blocks[b[0]].input[b[1]].value=a.value;
          }
        });
      }
    });
  }
  static destroy(id){
    delete Block.blocks[id];
  }
  static deleteConnection(from:[number,number],to:[number,number]){
    Block.blocks[to[0]].input[to[1]].IO=[];
    for(var i:number=0;i<Block.blocks[from[0]].output[from[1]].IO.length;i++){
      if(Block.blocks[from[0]].output[from[1]].IO[0]==to[0] && Block.blocks[from[0]].output[from[1]].IO[1]==to[1]){
        Block.blocks[from[0]].output[from[1]].IO.splice(i,1);
        break;
      }
    }
  }
};
var EventCatcher={
  CastIsNaN:null,
  Log:(param)=>{
    console.log(param);
  },
  NullBlockError:()=>{
    throw "NodeExecutorError: No execution command on this type of node. Are you sure the right node type is provided?";
  },
  AutoCastError:()=>{
    throw "These types are not compatible to automaticaly convert with each other. Try using a cast instead";
  },
  ProgramTermination:()=>{
    console.info("Success");
  },
  BlockUpdate:(id)=>{
    console.warn("Block with id of "+id+" should get updated to not cause any misunderstandings");
  }
};
class Program{
  constructor(){
    Block.blocks={};
    Block.blockDeclared=0;
    new Block(BLOCK_TYPE.STARTER);
    EventCatcher.BlockUpdate(0);
  }
  start(){
    Block.blocks[0].execute(0);
  }
  create(type:number){
    new Block(type);
    EventCatcher.BlockUpdate(Block.blockDeclared-1);
  }
  destroy(id:number){
    if(id!=0){
      Block.destroy(id);
    }
  }
  addConnection(fromId:number,fromPort:number,toId:number,toPort:number){
    Block.addConnection([fromId,fromPort],[toId,toPort]);
    EventCatcher.BlockUpdate(fromId);
    EventCatcher.BlockUpdate(toId);
  }
  destroyConnection(fromId:number,fromPort:number,toId:number,toPort:number){
    Block.deleteConnection([fromId,fromPort],[toId,toPort]);
    EventCatcher.BlockUpdate(fromId);
    EventCatcher.BlockUpdate(toId);
  }
  setParameter(id,port,value){
    Block.setParameter(id,port,value);
    if(Block.blocks[id].type==BLOCK_TYPE.ADD_N){//exception for adder
      for (let i = Block.blocks[id].input.length-1; i >= 3 ; i++) {
        if(Block.blocks[id].input[i].value==0 && Block.blocks[id].input[i].IO==[]){
          Block.blocks[id].input.pop();
        }else{
          break;
        }

      }
      if(Block.blocks[id].input[Block.blocks[id].input.length-1].value!=0 || Block.blocks[id].input[Block.blocks[id].input.length-1].IO!=[]){
        Block.blocks[id].input.push({type:CONNECTION_TYPE.NUMBER,value:0,IO:[]});
      }
    }
    if(Block.blocks[id].type==BLOCK_TYPE.MUL_N){//exception for adder
      for (let i = Block.blocks[id].input.length-1; i >= 3 ; i++) {
        if(Block.blocks[id].input[i].value==1 && Block.blocks[id].input[i].IO==[]){
          Block.blocks[id].input.pop();
        }else{
          break;
        }

      }
      if(Block.blocks[id].input[Block.blocks[id].input.length-1].value!=1 || Block.blocks[id].input[Block.blocks[id].input.length-1].IO!=[]){
        Block.blocks[id].input.push({type:CONNECTION_TYPE.NUMBER,value:1,IO:[]});
      }
    }
  }
}
/*
let st=new Block(BLOCK_TYPE.STARTER);
let nd=new Block(BLOCK_TYPE.LOG);
new Block(1);
new Block(2);
Block.addConnection([0,0],[1,0]);
Block.addConnection([1,0],[2,0]);
Block.addConnection([2,0],[3,0]);
Block.setParameter(1,1,"ok");
Block.setParameter(2,1," boomer");
st.execute();
*/
