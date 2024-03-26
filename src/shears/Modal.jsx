import React  from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";

const PopUpModal = ({
  children,
  toggle,
  Submit,
  isOpen,
  ModalTitle,
  loading,
  Cancel,
  handleClick,
  handleClose,
  className
}) => {

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>{ModalTitle}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button className="button1" onClick={handleClick}>
            <span>{loading ? <Spinner /> : Submit}</span>
          </Button>
          <Button type="reset" color="secondary" onClick={handleClose}>
            {Cancel}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PopUpModal;
