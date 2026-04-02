import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import TradeForm from '../Exploredetail/PlaceTradeComponent';

const PlacePredictionModal: React.FC<{ show: boolean; handleClose: () => void }> = ({
  show,
  handleClose,
}) => {
  const [direction, setDirection] = useState<'UP' | 'DOWN'>('UP')
  const [amount, setAmount] = useState(5)

  const maxPosition = 5
  const balance = 500
  const quickValues = [5, 10, 50, 100, 250]

  const feeValue = amount * 0.05
  const effectiveAmount = amount - feeValue
  const potentialWin = effectiveAmount * 2

  const handlePlacePrediction = () => {
    console.log('Prediction placed:', { direction, amount })
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleClose} centered className="prediction-modal">
      <Modal.Header closeButton>
        <Modal.Title>Place Prediction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TradeForm
          direction={direction}
          setDirection={setDirection}
          amount={amount}
          setAmount={setAmount}
          maxPosition={maxPosition}
          balance={balance}
          quickValues={quickValues}
          feeValue={feeValue}
          effectiveAmount={effectiveAmount}
          potentialWin={potentialWin}
          onPlacePrediction={handlePlacePrediction}
        />
      </Modal.Body>
    </Modal>
  )
}

export default PlacePredictionModal