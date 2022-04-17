import React, { useCallback, useEffect, useState } from "react";
import { CheckType, CheckTypeStrict, fetchChecks, submitCheckResults, ValueType } from "../../api";
import Button from "../Button/Button";
import Check from "../Check/Check";
import findIndexOfFinalMatch from "../../util/findIndexOfFinalMatch";
import sort from "../../util/sort";
import sumWithLimits from "../../util/sumWithLimits";
import "./Checks.css";

enum RequestStatus {
  NONE = 'none',
  LOADING = 'loading',
  FAILED = 'failed',
  SUCCESS = 'success'
}

const Checks = () => {
  const [checks, setChecks] = useState([] as CheckType[]);
  const [activeCheck, setActiveCheck] = useState(-1);
  const [lastEnabledCheck, setLastEnabledCheck] = useState(0);
  const [fetchStatus, setFetchStatus] = useState(RequestStatus.NONE);
  const [submitStatus, setSubmitStatus] = useState(RequestStatus.NONE);

  function getChecks() {
    setFetchStatus(RequestStatus.LOADING);

    fetchChecks()
      .then((result: CheckType[]) => {
        setChecks(sort(result, 'priority'));
        setFetchStatus(RequestStatus.SUCCESS);
      })
      .catch(() => setFetchStatus(RequestStatus.FAILED));
  }

  const handleValueSelect = useCallback((index: number, value: ValueType) => {
    if (checks[index].value !== value) {
      const checksCopy = [...checks];
      checksCopy[index] = { ...checks[index], value };
      setChecks(checksCopy);

      if (value === 'yes') {
        const lastIndex = findIndexOfFinalMatch(checks, 'value', 'yes', index);
        setLastEnabledCheck(sumWithLimits(lastIndex, 1, 0, checks.length - 1));
      }

      if (value === 'no') {
        setLastEnabledCheck(index);
      }
    }

    setActiveCheck(index);
  }, [checks]);

  const handleSubmit = () => {
    setSubmitStatus(RequestStatus.LOADING);

    const slicedChecks = checks.slice(0, lastEnabledCheck + 1) as CheckTypeStrict[];
    submitCheckResults(slicedChecks.map(({ id, value }: CheckTypeStrict) => ({ checkId: id, value })))
      .then(() => setSubmitStatus(RequestStatus.SUCCESS))
      .catch(() => setSubmitStatus(RequestStatus.FAILED));
  };

  const getActiveCheck = useCallback((increment: number) => {
    return sumWithLimits(activeCheck, increment, 0, lastEnabledCheck);
  }, [activeCheck, lastEnabledCheck]);

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

  if (fetchStatus === RequestStatus.LOADING) {
    return <p>Loading...</p>;
  }

  if (fetchStatus === RequestStatus.FAILED) {
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
            disabled={index > lastEnabledCheck}
            key={check.id}
            onValueSelect={value => handleValueSelect(index, value)}
          />
        ))}
      </ul>

      <div className="Checks__footer">
        <Button
          disabled={submitStatus === RequestStatus.LOADING
            || !(checks.some((check: CheckType) => check.value === 'no')
            || checks.every((check: CheckType) => check.value === 'yes'))}
          onClick={handleSubmit}
        >
          Submit
        </Button>

        <div className="Checks__submit-status">
          {submitStatus === RequestStatus.LOADING && <p>Submitting...</p>}
          {submitStatus === RequestStatus.FAILED && <p>Failed to submit, please try again</p>}
          {submitStatus === RequestStatus.SUCCESS && <p>Submitted!</p>}
        </div>
      </div>
    </div>
  );
};

export default Checks;
