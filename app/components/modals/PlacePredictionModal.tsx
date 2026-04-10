import React from 'react'
import { Modal } from 'react-bootstrap'
import TradeForm from '../Exploredetail/PlaceTradeComponent';

interface PlacePredictionModalProps {
  show: boolean;
  handleClose: () => void;
  direction: "UP" | "DOWN";
  setDirection: (dir: "UP" | "DOWN") => void;
  amount: number;
  setAmount: (val: number) => void;
  maxPosition: number;
  balance: number;
  quickValues: number[];
  feeValue: number;
  effectiveAmount: number;
  potentialWin: number;
  onPlacePrediction: () => void;
  isTradeLoading?: boolean;
}

const PlacePredictionModal: React.FC<PlacePredictionModalProps> = ({
  show,
  handleClose,
  direction,
  setDirection,
  amount,
  setAmount,
  maxPosition,
  balance,
  quickValues,
  feeValue,
  effectiveAmount,
  potentialWin,
  onPlacePrediction,
  isTradeLoading,
}) => {
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
          onPlacePrediction={onPlacePrediction}
          isTradeLoading={isTradeLoading}
        />
      </Modal.Body>
    </Modal>
  )
}

export default PlacePredictionModal
