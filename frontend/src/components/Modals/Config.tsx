import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Button, Column, Input, Row } from 'angel_ui';

interface IConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ConfigModal({ isOpen, onClose }: IConfigModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='md'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Configurações do meet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Column horizontalAlign='start' mb='mb-4'>
            
          </Column>
        </ModalBody>

        <ModalFooter>
          <Row horizontalAlign='end'>
            {/* <Button>Adicionar participante</Button> */}
          </Row>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ConfigModal };