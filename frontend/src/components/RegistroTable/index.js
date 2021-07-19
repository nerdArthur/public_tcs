import React, { useEffect, useState } from "react";
import { api } from "../../api";
import MaterialTable from "material-table";
import { useLocation } from "react-router";

const statusRegistro = {
  I: "INATIVO",
  S: "SOLICITADO",
  E: "ENVIADO",
  R: "RECEBIDO",
  L: "LIDO",
};

const registroStatus = {
  INATIVO: "I",
  SOLICITADO: "S",
  ENVIADO: "E",
  RECEBIDO: "R",
  LIDO: "L",
};

export default function RegistroTable() {
  const location = useLocation();

  const [data, setData] = useState({
    data: [],
    page: 0,
    totalCount: 5,
  });

  const [iserror, setIserror] = useState(false);
  const [alertHidden, setAlertHidden] = useState([false]);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    api
      .get(location.pathname, {
        headers: { authorization: localStorage.getItem("@tcc/jwt") },
      })
      .then((res) => {
        const registros = res.data.data.map((e) => ({
          ...e,
          status: statusRegistro[e.status],
        }));

        const data = { ...res.data, data: registros };

        setData(data);
      })
      .catch((error) => {
        setErrorMessages([error.response]);
        setAlertHidden(true);
        setIserror(true);
      });
  }, [location.pathname]);

  const handleRowAdd = (newData, resolve) => {
    api
      .post(`${location.pathname}/${newData.id}`, newData, {
        headers: { authorization: localStorage.getItem("@tcc/jwt") },
      })
      .then((res) => {
        // let dataToAdd = [...data];
        // dataToAdd.push(newData);
        // setData(res.data);
        resolve();
        setErrorMessages([]);
        setIserror(false);
      })
      .catch((error) => {
        setErrorMessages(["Não pode adicionar data!\n", error.response]);
        setIserror(true);
        resolve();
      });
  };

  const handleRowUpdate = (newData, oldData, resolve) => {
    newData.status = registroStatus[newData.status];

    api
      .put(`${location.pathname}/${newData.id}`, newData, {
        headers: { authorization: localStorage.getItem("@tcc/jwt") },
      })
      .then((res) => {
        const dataUpdate = [...data.data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setData([...dataUpdate]);
        resolve();
        setIserror(false);
        setErrorMessages([]);
      })
      .catch((error) => {
        setErrorMessages([error.response]);
        setIserror(true);
        resolve();
      });
  };

  const handleRowDelete = (oldData, resolve) => {
    api
      .delete(`${location.pathname}/${oldData.id}`)
      .then((res) => {
        const dataDelete = [...data.data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      })
      .catch((error) => {
        setErrorMessages([error.response]);
        setIserror(true);
        resolve();
      });
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        actions={[
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
              window.location.reload();
            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve);
              window.location.reload();
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve);
              window.location.reload();
            }),
        }}
        columns={[
          { title: "ID", field: "id", hidden: true },
          { title: "Linha", field: "linha" },
          { title: "Telefone", field: "telefoneDestinatario" },
          // { title: "Arquivo/link", field: "arquivoOuLink" },
          // { title: "Codigo", field: "cdLinha" },
          { title: "Nome destinatário", field: "nomeDestinatario" },
          { title: "Status", field: "status" },
        ]}
        options={{
          search: false,
        }}
        data={data.data}
        title="Registros da campanha"
      />
    </div>
  );
}
