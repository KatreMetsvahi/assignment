import React, { useCallback, useEffect, useState } from "react";
import { CheckType, fetchChecks, ValueType } from "../../api";
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

  const handleValueSelect = useCallback((index: number, value: ValueType) => {
    if (checks[index].value !== value) {
      const checksCopy = [...checks];
      checksCopy[index] = { ...checks[index], value };
      setChecks(checksCopy);
    }

    setActiveCheck(index);
  }, [checks]);

  const getActiveCheck = useCallback((increment: number) => {
    return sumWithLimits(activeCheck, increment, 0, checks.length - 1);
  }, [activeCheck, checks.length]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      setActiveCheck(getActiveCheck(1));
    }

    if (event.key === 'ArrowUp') {
      setActiveCheck(getActiveCheck(-1));
    }

    if (event.key === "1" && activeCheck !== -1) {
      handleValueSelect(activeCheck, "yes");
    }

    if (event.key === "2" && activeCheck !== -1) {
      handleValueSelect(activeCheck, "no");
    }
  }, [activeCheck, getActiveCheck, handleValueSelect]);

  useEffect(() => {
    getChecks();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

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
          <Check
            {...check}
            active={activeCheck === index}
            key={check.id}
            onValueSelect={value => handleValueSelect(index, value)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Checks;
