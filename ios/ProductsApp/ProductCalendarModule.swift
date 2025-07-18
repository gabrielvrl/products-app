import Foundation
import EventKit
import React

@objc(ProductCalendarModule)
class ProductCalendarModule: NSObject {

  @objc
  func addPurchaseReminder(_ title: String, date: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let eventStore = EKEventStore()
    eventStore.requestAccess(to: .event) { (granted, error) in
      if let error = error {
        rejecter("PERMISSION_ERROR", "Erro ao pedir permissão: \(error.localizedDescription)", error)
        return
      }
      if !granted {
        rejecter("PERMISSION_DENIED", "Permissão negada para acessar o calendário", nil)
        return
      }
      let event = EKEvent(eventStore: eventStore)
      event.title = title
      event.startDate = Date(timeIntervalSince1970: date.doubleValue / 1000)
      event.endDate = event.startDate.addingTimeInterval(60 * 60) // 1 hora
      event.calendar = eventStore.defaultCalendarForNewEvents
      do {
        try eventStore.save(event, span: .thisEvent)
        resolver("Evento criado com sucesso")
      } catch let err {
        rejecter("SAVE_ERROR", "Erro ao salvar evento: \(err.localizedDescription)", err)
      }
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
