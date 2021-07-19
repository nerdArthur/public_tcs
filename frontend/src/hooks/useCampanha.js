import React, { useState, useEffect } from "react";
import { api } from "../../api";

const FetchCampanha = (page) => {
  const [campanhas, setCampanhas] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    api
      .get(`/campanha`, {
        headers: { authorization: localStorage.getItem("@tcc/jwt") },
      })
      .then((res) => {
        setCampanhas(res.data);
      })
      .catch((error) => {
        setErrorMessages([error.response]);
        setIserror(true);
      });
  }, []);
};

export { FetchCampanha };
