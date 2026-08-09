class RaceMusic{
  private context:AudioContext|null=null; private master:GainNode|null=null; private timer:number|null=null; private step=0;
  start(muted:boolean){this.stop();const Context=window.AudioContext||window.webkitAudioContext;this.context=new Context();this.master=this.context.createGain();this.master.gain.value=muted?0:.09;this.master.connect(this.context.destination);void this.context.resume();this.tick();this.timer=window.setInterval(()=>this.tick(),180)}
  setMuted(muted:boolean){if(this.context&&this.master)this.master.gain.setTargetAtTime(muted?0:.09,this.context.currentTime,.03)}
  stop(){if(this.timer!==null)window.clearInterval(this.timer);this.timer=null;if(this.context){void this.context.close();this.context=null;this.master=null}}
  private note(frequency:number,duration:number,type:OscillatorType,volume:number,delay=0){if(!this.context||!this.master)return;const at=this.context.currentTime+delay,osc=this.context.createOscillator(),gain=this.context.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,at);gain.gain.setValueAtTime(.001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.012);gain.gain.exponentialRampToValueAtTime(.001,at+duration);osc.connect(gain).connect(this.master);osc.start(at);osc.stop(at+duration+.02)}
  private tick(){const bass=[73.42,73.42,87.31,65.41][Math.floor(this.step/4)%4];if(this.step%2===0)this.note(bass,.26,'sawtooth',.34);this.note(this.step%4===2?1800:1100,.035,'square',.08);if(this.step%4===0)this.note(55,.08,'triangle',.45);if(this.step%8===6)this.note([293.66,349.23,329.63,246.94][Math.floor(this.step/8)%4],.2,'square',.11,.02);this.step=(this.step+1)%32}
}
export const raceMusic=new RaceMusic();
