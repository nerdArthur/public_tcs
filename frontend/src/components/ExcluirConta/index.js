import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { api } from "../../api";

const ExcluirUsuarioModal = (props) => {
  const history = useHistory();

  const handleClick = (props) => {
    const jwt = localStorage.getItem("@tcc/jwt");

    api
      .delete("/user", { headers: { authorization: jwt } })
      .then(({ status }) => {
        if (status === 204) {
          props.onHide();

          localStorage.removeItem("@tcc/jwt");
          history.push("/");
        }
      })
      .catch((err) => console.error(err));

    console.log("AQUI", jwt);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Excluir conta
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Deseja excluir a conta?</h4>
        <p>
          Caso deseje excluir sua conta, todas as suas campanhas serão excluídas
          do sistema.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancelar</Button>
        <Button onClick={() => handleClick(props)}>Excluir</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExcluirUsuarioModal;
