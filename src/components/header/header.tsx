import ASCIIAnimation from "../ascii-animation";

const animLeft = [
  <><span className="text-stone-900">{'>'}</span><span className="text-stone-900">{'>'}</span><span className="text-stone-900">{'>'}</span></>,
  <><span className="amber">{'>'}</span><span className="text-stone-900">{'>'}</span><span className="text-stone-900">{'>'}</span></>,
  <><span className="text-stone-900">{'>'}</span><span className="amber">{'>'}</span><span className="text-stone-900">{'>'}</span></>,
  <><span className="text-stone-900">{'>'}</span><span className="text-stone-900">{'>'}</span><span className="amber">{'>'}</span></>,
  <><span className="text-stone-900">{'>'}</span><span className="text-stone-900">{'>'}</span><span className="text-stone-900">{'>'}</span></>,
];

const animRight = [
  <><span className="text-stone-900">{'<'}</span><span className="text-stone-900">{'<'}</span><span className="text-stone-900">{'<'}</span></>,
  <><span className="text-stone-900">{'<'}</span><span className="text-stone-900">{'<'}</span><span className="amber">{'<'}</span></>,
  <><span className="text-stone-900">{'<'}</span><span className="amber">{'<'}</span><span className="text-stone-900">{'<'}</span></>,
  <><span className="amber">{'<'}</span><span className="text-stone-900">{'<'}</span><span className="text-stone-900">{'<'}</span></>,
  <><span className="text-stone-900">{'<'}</span><span className="text-stone-900">{'<'}</span><span className="text-stone-900">{'<'}</span></>,
];

function Header() {
  return(
    <>
        <h1 className="font-glassTTYVT220 text-[40px]">
          <ASCIIAnimation frames={animLeft} rate={300} />
          {' '}<span className="amber">TESTING</span> {' '}
          <ASCIIAnimation frames={animRight} rate={300} />
        </h1>
        <h2 className="crtFont slate">
          The URL shortener
        </h2>
    </>
  );
}

export default Header;