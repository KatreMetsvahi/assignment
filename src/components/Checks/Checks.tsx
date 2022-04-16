import React, { useEffect, useState } from "react";
import { CheckType, fetchChecks } from "../../api";
import Button from "../Button/Button";
import Check from "../Check/Check";
import sort from "../../util/sort";
import sumWithLimits from "../../util/sumWithLimits";
import "./Checks.css";

const Checks = () => {
  const [checks, setChecks] = useState([] as CheckType[]);
  const [activeCheck, setActiveCheck] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  function getChecks() {
    setIsLoading(true);
    setHasError(false);

    fetchChecks()
      .then((result: CheckType[]) => setChecks(sort(result, 'priority')))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    getChecks();
  }, []);

  useEffect(() => {
    function getActiveCheck(increment: number) {
      return sumWithLimits(activeCheck, increment, 0, checks.length - 1);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown') {
        setActiveCheck(getActiveCheck(1));
      }

      if (event.key === 'ArrowUp') {
        setActiveCheck(getActiveCheck(-1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [activeCheck, checks.length]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (hasError) {
    return (
      <div className="Checks Checks--has-error">
        <p>Error loading data.</p>
        <Button onClick={getChecks}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="Checks">
      <ul className="Checks__list">
        {checks.map((check: CheckType, index: number) => (
          <Check {...check} active={activeCheck === index} key={check.id} />
        ))}
      </ul>
    </div>
  );
};

export default Checks;
