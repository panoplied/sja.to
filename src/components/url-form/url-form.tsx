import React, { useState } from 'react';
import debounce from 'debounce';
import copy from 'copy-to-clipboard';
import { trpc } from '../../utils/trpc';
import rndChars from '../../utils/random-chars';

// Renaming this since we have own `generateSlug` function here
import { generateSlug as rndWords } from 'random-word-slugs';

import fetchUrl from '../../pages/api/fetch-url/[slug]';
import ASCIIAnimation from '../ascii-animation';

type UrlShortcut = {
  url: string;
  slug: string;
};

function UrlForm() {

  // "Virtual" URL value used for visual validation only
  const [urlValue, setUrlValue] = useState('');
  
  // Real URL and slug values are stored in shortcut object
  const [shortcut, setShortcut] = useState<UrlShortcut>({ url: '', slug: '' });

  // Routine status states
  const [urlInputActivated, setUrlInputActivated] = useState(false);
  const [urlConfirmed, setUrlConfirmed] = useState(false);
  const [slugGenerating, setSlugGenerating] = useState(false);

  // DB comms settings
  const addUrl = trpc.useMutation(["addUrl"]);
  const checkShortcut = trpc.useQuery(["fetchUrl", { slug: shortcut.slug }], {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Frameset for `ASCIIAnimation` component used as progress indicator
  const progressAnimationFrames = [
    <> / PROCESSING /</>,
    <> - PROCESSING -</>,
    <> \ PROCESSING \</>,
    <> | PROCESSING |</>,
  ];

  // TODO: implement proper URL validation
  function isValidURL(url: string) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Handles visual URL validation
  function handleURLInput(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setUrlInputActivated(true);
    if (isValidURL(url)) {
      setUrlValue(url);
    } else {
      setUrlValue('');
    }
  }

  // Handles real URL confirmation (UrlShortcut object state setting)
  // Switches form rendering based on urlConfirmed state
  function handleURLConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const urlElement = e.currentTarget.elements[0] as HTMLInputElement | null;  // TS is a mess
    if (urlElement != null) {

      const url = urlElement.value;
      if (isValidURL(url)) {

        // Set real URL state
        // Using random string of chars for the "slug" by default
        setShortcut({ ...shortcut, url: url, slug: generateSlug("chars") });

        // Set urlConfirmed state flag for conditional rendering for the whole form
        setUrlConfirmed(true);
      }

    }
  }

  // Pseudo-randomly generates "slug" part of the URL (can also be a string of random chars)
  function generateSlug(type: string) {

    setSlugGenerating(true);

    let slug = '';

    do {
      if (type === "chars") {
        slug = rndChars(8);
      } else if (type === "words") {
        slug = rndWords();
      }
    } while (checkShortcut.data?.used); // Regenerate slug if we have the same one in DB already

    setSlugGenerating(false);

    return slug;
  }


  // RENDERING

  if (!urlConfirmed) {
    return(

      <form
        className="crtFont flex flex-col items-center"
        spellCheck="false"
        onSubmit={handleURLConfirm}
      >

        <input
          type="text"
          id="url"  // Need this ID to get the url in the confirmation handler
          className={`p-[10px] text-center border-2 bg-black xs:w-[300px]
            focus:outline-none focus:placeholder-transparent focus:border-emerald-200 focus:ring-2 focus:ring-emerald-200
            ${!urlInputActivated || urlValue ?
              ('emerald border-emerald-400 selection:bg-emerald-900 selection:text-emerald-100 caret-emerald-200') :
              ('red border-red-500 selection:bg-red-900 selection:text-red-100 caret-red-200')
            }
          `}
          placeholder="PASTE URL"
          onChange = { debounce(handleURLInput, 500) }
          onFocus = { e => { e.target.placeholder = '' } }
          onBlur = { e => { e.target.placeholder = 'ENTER URL' } }
          required
        />

        <input
          type="submit"
          value="CONFIRM ->"
          className="p-[10px] center mt-[30px] emerald border-2 xs:w-[300px]
          focus:outline-none focus:ring-2 focus:ring-emerald-200
          hover:bg-emerald-800
          active:bg-emerald-700
          bg-emerald-900 border-t-emerald-300 border-l-emerald-300 border-b-emerald-500 border-r-emerald-500 cursor-pointer
          disabled:bg-stone-900 disabled:border-t-stone-700 disabled:border-l-stone-700 disabled:border-b-stone-800 disabled:border-r-stone-800 disabled:text-stone-400 disabled:cursor-not-allowed" 
          disabled = { urlValue === '' || !urlInputActivated }
        />

      </form>

    );
  }
  
  else {
    console.log(shortcut.url);
    console.log(shortcut.slug);

    // Combine our baseURL
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    const baseURL = `${protocol}//${hostname}${port ? ':' + port : ''}`;
    return(
      <>
      <form
        className="crtFont flex flex-col emerald items-center"
        onSubmit = { (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          addUrl.mutate({ ...shortcut });
          copy(`${baseURL}/${shortcut.slug}`)
          console.log(addUrl.status);
        }}
      >



        <div className="p-[10px] text-center border-2 break-all min-w-[300px]
        bg-black border-emerald-400 selection:bg-emerald-900 selection:text-emerald-100">
          {slugGenerating ? <ASCIIAnimation frames={progressAnimationFrames} rate={100} /> :
          <>
            <span className="green">{baseURL}/</span>
            <span>{shortcut.slug}</span>
          </>
          }
        </div>

        {/* Regenerate options */}
        <div>
          <input
            type="button"
            value="CHARS"
            className="py-[0px] px-[20px] mt-[10px] emerald border-2 mr-[10px]
            focus:outline-none focus:ring-2 focus:ring-emerald-200
            hover:bg-emerald-800
            active:bg-emerald-700
            bg-emerald-900 border-t-emerald-300 border-l-emerald-300 border-b-emerald-500 border-r-emerald-500 cursor-pointer"
            onClick = {() => setShortcut({ ...shortcut, slug: generateSlug("chars") })}
          />
          <input
            type="button"
            value="WORDS"
            className="py-[0px] px-[20px] mt-[10px] emerald border-2
            focus:outline-none focus:ring-2 focus:ring-emerald-200
            hover:bg-emerald-800
            active:bg-emerald-700
            bg-emerald-900 border-t-emerald-300 border-l-emerald-300 border-b-emerald-500 border-r-emerald-500 cursor-pointer"
            onClick = {() => setShortcut({ ...shortcut, slug: generateSlug("words") })}
          />
        </div>

        {/* Submit, saves to DB */}
        <input
          type="submit"
          value="SAVE ->"
          className="p-[10px] mt-[40px] emerald border-2 xs:w-[300px] 
          focus:outline-none focus:ring-2 focus:ring-emerald-200
          hover:bg-emerald-800
          active:bg-emerald-700
          bg-emerald-900 border-t-emerald-300 border-l-emerald-300 border-b-emerald-500 border-r-emerald-500 cursor-pointer
          disabled:bg-stone-900 disabled:border-t-stone-700 disabled:border-l-stone-700 disabled:border-b-stone-800 disabled:border-r-stone-800 disabled:text-stone-400 disabled:cursor-not-allowed" 
          disabled = { urlValue === '' || !urlInputActivated }
        />


      </form>

      <div className="crtFont emerald mt-[20px] text-center">
        {/* <p>Click shortcut to SAVE and COPY</p> */}
        <p>Points to {shortcut.url}</p>
      </div>
      </>

    );
  }

}

export default UrlForm;