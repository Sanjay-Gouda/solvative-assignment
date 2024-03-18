import React, { useEffect, useRef, useState } from "react";

import "./searchbar-style.css";

type TsearchProps = {
  onChange: (e: any) => void;
  handleKeyDown: (e: any) => void;
};

const Searchbar = ({ onChange, handleKeyDown }: TsearchProps) => {
  const inputRef = useRef(null);

  /* Keyboard Shortcut */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "/") {
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="search-wrapper">
        <input
          type="text"
          className="search-box"
          placeholder="Search places..."
          ref={inputRef}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />

        <button className="ctrl-btn">Ctrl + /</button>
      </div>
    </>
  );
};

export default Searchbar;
