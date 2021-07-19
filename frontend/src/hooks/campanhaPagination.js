import { useEffect, useState } from "react";
import qs from "query-string";
import { useHistory, useLocation } from "react-router";

const usePagination = () => {
  const history = useHistory();
  const location = useLocation();

  const getActualPage = () => {
    const queryParams = qs.parse(location.search);
    const page = queryParams.page;

    return page ? Number(page) : undefined;
  };

  const [actualPage, setActualPage] = useState(getActualPage() || 1);

  useEffect(() => {
    const queryParams = qs.parse(location.search);

    history.push({
      search: qs.stringify({
        ...queryParams,
        page: actualPage,
      }),
    });
  }, [actualPage]);

  return {
    actualPage,
    setActualPage,
  };
};

export default usePagination;
