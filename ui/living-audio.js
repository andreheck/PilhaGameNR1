/** Gentle tones, unlocked only by a real user gesture. */
let context=null,last=0,played=0,muted=false;
export function unlock(){try{context??=new (window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{});}catch{}}
export function tone(kind='info'){if(muted||!context||context.state!=='running')return false;const now=context.currentTime;if(now-last<.12)return false;last=now;const notes=kind==='success'?[523,659,784]:kind==='alert'?[440,330]:kind==='select'?[587]:[659,784];notes.forEach((hz,i)=>{const o=context.createOscillator(),g=context.createGain(),at=now+i*.095;o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.045,at+.012);g.gain.exponentialRampToValueAtTime(.0001,at+.18);o.connect(g);g.connect(context.destination);o.start(at);o.stop(at+.2);});played++;return true;}
export function toggleSound(){muted=!muted;return !muted;}
export function audioStatus(){return {state:context?.state||'locked',played,muted};}
if(typeof document!=='undefined')for(const ev of ['pointerdown','keydown'])document.addEventListener(ev,unlock,{capture:true});
