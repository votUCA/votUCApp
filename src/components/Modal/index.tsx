import {
  Avatar,
  Button,
  Layout,
  Modal as KModal,
  Text
} from '@ui-kitten/components'
import React, { useState, useEffect } from 'react'
import { CommonActions, useNavigation } from '@react-navigation/native'
import styles from './style'
import image from '../../assets/logo_mail.png'
import { Routes } from '../../navigator'

type ModalProps = {
  title: string
  subtitle: string
  visible: boolean
}

const Modal = ({ title, subtitle, visible }: ModalProps) => {
  const [isVisible, setVisible] = useState(visible)
  const { dispatch } = useNavigation()

  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{ name: Routes.CENSUS }]
  })
  useEffect(() => {
    setVisible(visible)
  }, [visible])
  return (
    <KModal allowBackdrop backdropStyle={styles.backdrop} visible={isVisible}>
      <Layout level="3" style={styles.modalContainer}>
        <Text style={styles.text} category="h5">
          {subtitle}
        </Text>
        <Text style={styles.text} category="h4">
          {title}
        </Text>
        <Avatar style={styles.logo} shape="square" source={image} />
        <Button
          onPress={() => {
            setVisible(false)
            dispatch(resetAction)
          }}
          style={styles.button}
          status="warning"
          size="giant">
          Volver al inicio
        </Button>
      </Layout>
    </KModal>
  )
}

export default Modal
