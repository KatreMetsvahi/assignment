import React, { useCallback, useEffect, useState } from "react";
import { CheckType, CheckTypeStrict, fetchChecks, submitCheckResults, ValueType } from "../../api";
import Button from "../Button/Button";
import Check from "../Check/Check";
import findIndexOfFinalMatch from "../../util/findIndexOfFinalMatch";
import sort from "../../util/sort";
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

  const getChecks = () => {
    setFetchStatus(RequestStatus.LOADING);

    fetchChecks()
      .then((result: CheckType[]) => {
        setChecks(sort(result, 'priority'));
        setFetchStatus(RequestStatus.SUCCESS);
      })
      .catch(() => setFetchStatus(RequestStatus.FAILED));
  };

  const handleSubmit = () => {
    setSubmitStatus(RequestStatus.LOADING);
    const slicedChecks = checks.slice(0, lastEnabledCheck + 1) as CheckTypeStrict[];
    const checkResults = slicedChecks.map(({ id, value }: CheckTypeStrict) => ({ checkId: id, value }));

    submitCheckResults(checkResults)
      .then(() => setSubmitStatus(RequestStatus.SUCCESS))
      .catch(() => setSubmitStatus(RequestStatus.FAILED));
  };

  const handleValueSelect = useCallback((index: number, value: ValueType) => {
    const updateCheckValue = () => {
      const checksCopy = [...checks];
      checksCopy[index] = { ...checks[index], value };
      setChecks(checksCopy);
    };

    if (checks[index] && checks[index].value !== value) {
      updateCheckValue();

      if (value === 'yes') {
        const lastIndex = findIndexOfFinalMatch(checks, 'value', 'yes', index);
        setLastEnabledCheck(Math.min(lastIndex + 1, checks.length - 1));
      }

      if (value === 'no') {
        setLastEnabledCheck(index);
      }
    }

    setActiveCheck(index);
  }, [checks]);

  useEffect(() => {
    getChecks();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          setActiveCheck(Math.min(activeCheck + 1, lastEnabledCheck));
          return;
        case 'ArrowUp':
          setActiveCheck(Math.max(activeCheck - 1, 0));
          return;
        case '1':
          handleValueSelect(activeCheck, "yes");
          return;
        case '2':
          handleValueSelect(activeCheck, "no");
          return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCheck, checks.length, handleValueSelect, lastEnabledCheck]);

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
          type="submit"
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
