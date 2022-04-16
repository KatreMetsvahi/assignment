import React, { useEffect, useState } from "react";
import { CheckType, fetchChecks } from "../../api";
import Button from "../Button/Button";
import Check from "../Check/Check";
import sort from "../../util/sort";
import "./Checks.css";

const Checks = () => {
  const [checks, setChecks] = useState([] as CheckType[]);
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
        {checks.map((check: CheckType) => <Check {...check} key={check.id} />)}
      </ul>
    </div>
  );
};

export default Checks;
