import { Button, Divider, Radio, RadioGroup, Text } from '@ui-kitten/components'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackIcon } from '../../assets/icons'
import Modal from '../../components/Modal'
import {
  SafeAreaLayout,
  SaveAreaInset
} from '../../components/safe-area-layout'
import Title from '../../components/Title'
import { Toolbar } from '../../components/Toolbar'
import {
  useCandidatesOfElectionQuery,
  useVoteElectionMutation
} from '../../generated/hooks'
import { ParticularElectionScreenProps } from '../../navigator/home.stack'
import styles from './styles'
import Loading from '../../components/Loading'

const ParticularElection = ({
  navigation,
  route
}: ParticularElectionScreenProps) => {
  const { data, loading } = useCandidatesOfElectionQuery({
    variables: { id: route.params.id }
  })
  const [vote] = useVoteElectionMutation()

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined
  )

  const [modal, setModal] = useState(false)

  const onCheckedChange = useCallback(
    (index: number) => setSelectedIndex(index),
    []
  )

  if (data) {
    return (
      <SafeAreaLayout style={{ flex: 1 }} insets={SaveAreaInset.TOP}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Toolbar
              title={data.election.description}
              backIcon={BackIcon}
              onBackPress={navigation.goBack}
            />
            <Divider />
            <View style={styles.safeArea}>
              <ScrollView>
                <Title
                  title={data.election.description}
                  subtitle={`${moment(data.election.start).format(
                    'L'
                  )} - ${moment(data.election.end).format('L')}`}
                />
                <Text style={styles.choice}> Su elección:</Text>
                <SafeAreaView style={styles.listView}>
                  <RadioGroup
                    selectedIndex={selectedIndex}
                    onChange={onCheckedChange}>
                    {data.election.candidates.map(candidate => (
                      <Radio
                        textStyle={styles.radioTextStyle}
                        text={`${candidate.firstName} ${candidate.lastName}`}
                        key={candidate.id}
                        status="warning"
                        style={styles.radio}
                      />
                    ))}
                  </RadioGroup>
                </SafeAreaView>
                <View style={styles.bottomButton}>
                  {/* <Button
              onPress={() => setValidate(prev => !prev)}
              style={styles.buttonLeft}
              size="giant">
              Validar mi elección
            </Button> */}
                  <Button
                    onPress={async () => {
                      const candidateId =
                        data.election.candidates[selectedIndex].id
                      const { errors } = await vote({
                        variables: {
                          input: {
                            candidates: [candidateId as string],
                            election: route.params.id
                          }
                        }
                      })
                      if (errors) {
                        console.warn(errors, { depth: Infinity })
                      } else {
                        setModal(true)
                      }
                    }}
                    disabled={selectedIndex === undefined}
                    style={styles.buttonRight}
                    size="giant">
                    VOTAR
                  </Button>
                </View>
                <Modal
                  visible={modal}
                  title="Gracias por su participación"
                  subtitle="Su voto ha sido enviado"
                />
              </ScrollView>
            </View>
          </>
        )}
      </SafeAreaLayout>
    )
  }
  return null
}

export default ParticularElection
