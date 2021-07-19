import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import { api } from "../../api";

import MaterialTable from "material-table";

export default function CampanhaTable() {
  const history = useHistory();

  const [data, setData] = useState({
    data: [],
    page: 0,
    totalCount: 5,
  });

  const [iserror, setIserror] = useState(false);
  const [alertHidden, setAlertHidden] = useState([false]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [page, setPage] = useState(0);

  const statusCampanha = {
    C: "CRIADA",
    I: "INICIADA",
    F: "FINALIZADA",
  };

  const campanhaStatus = {
    CRIADA: "C",
    INICIADA: "I",
    FINALIZADA: "F",
  };

  useEffect(() => {
    api
      .get(`/campanha?page=${page}`, {
        headers: { authorization: localStorage.getItem("@tcc/jwt") },
      })
      .then((res) => {
        const campanhas = res.data.data.map((e) => ({
          ...e,
          status: statusCampanha[e.status],
        }));

        const data = { ...res.data, data: campanhas };
        setData(data);
      })
      .catch((error) => {
        setErrorMessages([error.message]);

        setAlertHidden(false);
        setIserror(true);
      });
  }, []);

  const handleRowAdd = (newData, resolve) => {
    const result = { ...newData, status: campanhaStatus[newData.status] };

    api
      .post(`/campanha`, result, {
        headers: { authorization: localStorage.getItem("@tcc/jwt") },
      })
      .then((res) => {
        resolve();
        setErrorMessages([]);
        setIserror(false);

        window.location.reload();
      })
      .catch((err) => {
        setErrorMessages(
          err.response.data.errors.length !== 0
            ? [err.response.data.errors]
            : [err.response.data.message]
        );

        resolve();
        setAlertHidden(false);
        setIserror(true);
      });
  };

  const handleRowUpdate = (newData, oldData, resolve) => {
    newData.status = campanhaStatus[newData.status];

    api
      .put(`/campanha/${newData.id}`, newData, {
        headers: { authorization: localStorage.getItem("@tcc/jwt") },
      })
      .then((res) => {
        const dataUpdate = [...data.data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setData([...dataUpdate]);

        resolve(window.location.reload());
      })
      .catch((err) => {
        setErrorMessages(
          !!err.response.data.errors
            ? [err.response.data.errors]
            : [err.response.data.message]
        );

        resolve();
        setAlertHidden(false);
        setIserror(true);
      });
  };

  const handleRowDelete = (oldData, resolve) => {
    api
      .delete(`/campanha/${oldData.id}`, {
        headers: { authorization: localStorage.getItem("@tcc/jwt") },
      })
      .then((res) => {
        const dataDelete = [...data.data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);

        window.location.reload();
        resolve();
      })
      .catch((err) => {
        setErrorMessages(
          !!err.response.data.errors
            ? [err.response.data.errors]
            : [err.response.data.message]
        );

        resolve();
        setAlertHidden(false);
        setIserror(true);
      });
  };

  const tableRef = React.createRef();

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        tableRef={tableRef}
        actions={[
          {
            icon: "last_page",
            tooltip: "Ver registros",
            onClick: (event, rowData) => {
              const registrosLocation = `/campanha/${rowData.id}/registro`;
              history.push(registrosLocation);
            },
          },
          {
            icon: "refresh",
            tooltip: "Refresh Data",
            isFreeAction: true,
            onClick: () => window.location.reload(),
          },
        ]}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);
              // window.location.reload();
            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve);
              window.location.reload();
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve);
            }),
        }}
        columns={[
          { title: "ID", field: "id", hidden: true },
          { title: "nome", field: "name" },
          { title: "status", field: "status" },
          {
            field: "iniciar",
            title: "iniciar",
            render: (rowData) => {
              if (rowData.status === statusCampanha.C) {
                return (
                  <Button
                    onClick={(evt) => {
                      api
                        .post(`/whats/send/${rowData.id}`)
                        .then((resp) => window.location.reload());
                    }}
                  >
                    Iniciar
                  </Button>
                );
              }
            },
          },
        ]}
        options={{
          search: false,
        }}
        data={data.data}
        title="Campanhas"
      />

      <Alert
        key={String(Math.round(Math.random(0, 20)))}
        variant={"danger"}
        hidden={alertHidden}
        onClose={() => setAlertHidden(true)}
        dismissible
      >
        {errorMessages[0] &&
          errorMessages[0].map((msg) => (
            <>
              {msg}
              <br />
            </>
          ))}
      </Alert>
    </div>
  );
}
