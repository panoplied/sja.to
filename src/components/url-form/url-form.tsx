import React, { useState } from 'react';
import debounce from 'debounce';
import { trpc } from '../../utils/trpc';
import rndChars from '../../utils/random-chars';

// Renaming this since we have own `generateSlug` function here
import { generateSlug as rndWords } from 'random-word-slugs';

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

  // DB comms
  const addUrl = trpc.useMutation(["addUrl"]);
  const slugAvailable = trpc.useQuery(["fetchUrl", { slug: shortcut.slug }]);


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
        setShortcut({ ...shortcut, url: url, slug: generateSlug("words") });

        // Set urlConfirmed state flag for conditional rendering for the whole form
        setUrlConfirmed(true);
      }

    }
  }

  // Pseudo-randomly generates "slug" part of the URL (can also be a string of random chars)
  function generateSlug(type: string) {
    let slug = '';
    if (type === "chars") {
      slug = rndChars(8);
    } else if (type === "words") {
      slug = rndWords();
    }
    return slug;
  }

  if (!urlConfirmed) {
    return(

      <form
        className="crtFont flex flex-col"
        spellCheck="false"
        onSubmit={handleURLConfirm}
      >

        <input
          type="text"
          id="url"  // Need this ID to get the url in the confirmation handler
          className={`p-[10px] text-center border-2 bg-black
            focus:outline-none focus:placeholder-transparent focus:border-emerald-200 focus:ring-2 focus:ring-emerald-200
            ${!urlInputActivated || urlValue ?
              ('emerald border-emerald-400 selection:bg-emerald-900 selection:text-emerald-100 caret-emerald-200') :
              ('red border-red-500 selection:bg-red-900 selection:text-red-100 caret-red-200')
            }
          `}
          placeholder="ENTER URL"
          onChange = { debounce(handleURLInput, 500) }
          onFocus = { e => { e.target.placeholder = '' } }
          onBlur = { e => { e.target.placeholder = 'ENTER URL' } }
          required
        />

        <input
          type="submit"
          value="CONFIRM ->"
          className="p-[10px] mt-[30px] emerald border-2 
          focus:outline-none focus:ring-2 focus:ring-emerald-200
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
    const baseURL = `${protocol}//${hostname}:${port ? port : ''}`;
    return(
      <>
      <form
        className="crtFont flex flex-col emerald"
        onSubmit = { (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          addUrl.mutate({ ...shortcut });
        }}
      >
        <div className="p-[10px] text-center border-2 bg-black border-emerald-400 selection:bg-emerald-900 selection:text-emerald-100">
          <span className="green">{baseURL}/</span>
          <span>{shortcut.slug}</span>
        </div>
      </form>

      <div className="crtFont emerald mt-[20px] text-center">
        <p>Click shortcut to SAVE and COPY</p>
        <p>Will redirect to {shortcut.url}</p>
      </div>
      </>

    );
  }

}

export default UrlForm;