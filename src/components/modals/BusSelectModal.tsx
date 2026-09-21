import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { airportService, Airport } from '../../services';
import AppButton from '../common/AppButton';

export interface BusSelectModalProps {
  visible: boolean;
  target: 'FROM' | 'TO';
  selectedCity: string;
  onClose: () => void;
  onSelectCity: (city: string) => void;
}
export const BusCitySelectModal: React.FC<BusSelectModalProps> = ({
  visible,
  target,
  selectedCity,
  onClose,
  onSelectCity,
}) => {

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View >
          {/* Drag Handle Bar */}
          <Text>my name is nishant tyagi</Text>
      
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
     modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: '80%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    paddingHorizontal: 20,
    elevation: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c1c6d7',
    alignSelf: 'center',
    marginVertical: 6,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  sheetTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#121c2a',
  },
  sheetSub: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: '#565e74',
    fontWeight: '600',
  },
  searchBoxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f4fb',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#121c2a',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f4fb',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
  },
  chipActive: {
    backgroundColor: '#0070ea',
    borderColor: '#0070ea',
  },
  chipText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#565e74',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  resultsScroll: {
    flex: 1,
  },
  cityRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  cityRowSelected: {
    backgroundColor: '#eff4ff',
  },
  cityRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  busIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f4fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busIconBadgeSelected: {
    backgroundColor: '#dae2fd',
  },
  cityNameText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: '#121c2a',
  },
  cityNameSelected: {
    color: '#0059bb',
    fontWeight: '700',
  },
  citySubText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#717786',
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0070ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#717786',
  },
 
});

export default BusCitySelectModal;
