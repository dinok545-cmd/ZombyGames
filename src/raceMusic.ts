class RaceMusic{
  private context:AudioContext|null=null; private master:GainNode|null=null; private timer:number|null=null; private step=0; private mode='menu';
  start(muted:boolean,mode='menu'){this.stop();this.mode=mode;const Context=window.AudioContext||window.webkitAudioContext;this.context=new Context();this.master=this.context.createGain();this.master.gain.value=muted?0:.13;this.master.connect(this.context.destination);void this.context.resume();this.tick();this.timer=window.setInterval(()=>this.tick(),this.mode==='past'?155:this.mode==='clothes'?205:this.mode==='pronouns'?180:260)}
  setMuted(muted:boolean){if(!muted&&!this.context){this.start(false,this.mode);return}if(this.context&&this.master)this.master.gain.setTargetAtTime(muted?0:.13,this.context.currentTime,.03)}
  stop(){if(this.timer!==null)window.clearInterval(this.timer);this.timer=null;if(this.context){void this.context.close();this.context=null;this.master=null}}
  private note(frequency:number,duration:number,type:OscillatorType,volume:number,delay=0){if(!this.context||!this.master)return;const at=this.context.currentTime+delay,osc=this.context.createOscillator(),gain=this.context.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,at);gain.gain.setValueAtTime(.001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.012);gain.gain.exponentialRampToValueAtTime(.001,at+duration);osc.connect(gain).connect(this.master);osc.start(at);osc.stop(at+duration+.02)}
  private tick(){
    const patterns:Record<string,number[]>={menu:[55,65.41,73.42,49],past:[73.42,87.31,98,65.41],pronouns:[82.41,98,110,73.42],clothes:[65.41,77.78,87.31,58.27]};
    const melodies:Record<string,number[]>={menu:[220,246.94,196,164.81],past:[293.66,349.23,329.63,246.94],pronouns:[329.63,392,440,293.66],clothes:[261.63,311.13,349.23,233.08]};
    const bass=patterns[this.mode]?.[Math.floor(this.step/4)%4]??55;
    if(this.step%2===0)this.note(bass,this.mode==='menu'?.45:.26,this.mode==='menu'?'triangle':'sawtooth',this.mode==='menu'?.26:.34);
    if(this.mode!=='menu')this.note(this.step%4===2?1800:1100,.035,'square',.08);
    if(this.step%4===0)this.note(bass/2,.1,'triangle',.4);
    if(this.step%8===6)this.note(melodies[this.mode]?.[Math.floor(this.step/8)%4]??220,this.mode==='menu'?.55:.2,'square',this.mode==='menu'?.07:.11,.02);
    if(this.mode==='clothes'&&this.step%8===2)this.note(523.25,.12,'sine',.09);
    this.step=(this.step+1)%32;
  }
}
export const raceMusic=new RaceMusic();
