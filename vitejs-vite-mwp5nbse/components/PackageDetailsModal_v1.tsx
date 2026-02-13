import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ChevronDown,
  AlertCircle,
  FileText,
  ClipboardList,
  Scale,
  Gavel,
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface PackageDetailsModalV1Props {
  pkgId?: number;
  onClose: () => void;
  onStart: () => void;
}

// --- БАЗА ТЕКСТОВ (Оригинальные тексты из твоего файла) ---
const modalContent = {
  ru: {
    labels: {
      included: 'ЧТО ВХОДИТ',
      important: 'ВАЖНО',
      cta: {
        start: 'НАЧАТЬ',
        buy: 'КУПИТЬ',
      },
    },
    packages: {
      1: {
        title: 'ПАКЕТ №1 «СТАРТОВЫЙ»',
        subtitle: 'ОРИЕНТАЦИЯ И СТРАТЕГИЯ',
        desc: 'Оценка вашей ситуации и возможных рисков.',
        items: [
          {
            title: 'Индивидуальная оценка',
            content:
              'Анализ вашей конкретной ситуации: текущий статус пребывания, документы, семейные и профессиональные обстоятельства. Цель - выявить возможные риски, ограничения и реальные перспективы.',
          },
          {
            title: 'Стратегия перехода',
            content:
              'На основе вашей ситуации формируется персональная стратегия дальнейших действий: возможные варианты перехода, их плюсы и минусы, последовательность шагов.',
          },
          {
            title: 'Анализ параграфов',
            content:
              'Проверяется, какие параграфы законодательства применимы именно к вам, какие из них реальны, а какие формально возможны, но на практике недостижимы.',
          },
          {
            title: 'Оценка готовности',
            content:
              'Вы поймёте, насколько вы готовы к следующим шагам: какие требования уже выполнены, чего не хватает и какие ещё условия необходимо выполнить.',
          },
        ],
        important:
          'Эта оценка является обязательным первым шагом для любых дальнейших действий.',
      },
      2: {
        title: 'ПАКЕТ №2 «САМОСТОЯТЕЛЬНЫЙ»',
        subtitle: 'РЕШЕНИЕ ДЛЯ САМОСТОЯТЕЛЬНОЙ ПОДАЧИ',
        desc: 'Все документы и инструкции для корректной самостоятельной подачи заявления.',
        items: [
          {
            title: 'Всё из пакета «Стартовый»',
            content:
              'Вы уже прошли оценку и понимаете свою ситуацию. Этот пакет опирается на результаты диагностики и использует их как основу для дальнейших действий. Вы не начинаете с нуля - вы действуете осознанно и по проверенной логике.',
          },
          {
            title: 'Формуляры и примеры заполнения',
            content:
              'Вы получаете формуляры и примеры их заполнения с пояснениями. Это снижает риск формальных ошибок и позволяет понять, как именно заполнять документы, а не просто что туда вписывать.',
          },
          {
            title: 'Сопроводительное письмо',
            content:
              'В пакет входит шаблон сопроводительного письма, которое объясняет вашу ситуацию и логику обращения. Это повышает шансы на корректное рассмотрение заявления и снижает риск формального отказа.',
          },
          {
            title: 'Инструкция и чек-лист',
            content:
              'Пошаговая инструкция и чек-лист позволяют вам пройти весь процесс подачи самостоятельно, ничего не забыв и не перепутав порядок действий. Это превращает сложную процедуру в управляемый процесс.',
          },
        ],
        important:
          'Вы подаёте документы самостоятельно, но можете зачесть стоимость предыдущих пакетов при переходе к юридическому сопровождению.',
      },
      3: {
        title: 'ПАКЕТ №3 «АДВОКАТСКИЙ»',
        subtitle: 'АДВОКАТСКОЕ ПРЕДСТАВИТЕЛЬСТВО',
        desc: 'Коммуникация с ведомством через нашу адвокатскую канцелярию.',
        items: [
          {
            title: 'Всё из пакета «Самостоятельный»',
            content:
              'Вы уже прошли оценку и понимаете свою ситуацию. Этот пакет опирается на результаты диагностики и использует их как основу для дальнейших действий. Вы не начинаете с нуля - вы действуете осознанно и по проверенной логике.',
          },
          {
            title: 'Подача через канцелярию',
            content:
              'Ваше заявление подаётся официально от имени нашей адвокатской канцелярии, что повышает его статус и внимание со стороны ведомства.',
          },
          {
            title: 'Доверенность и коммуникация',
            content:
              'Вы подписываете адвокатскую доверенность, и мы берём на себя всю переписку с ведомством, отвечая на дополнительные запросы и уточнения.',
          },
          {
            title: 'Контроль сроков',
            content:
              'Мы осуществляем профессиональный контроль за соблюдением ведомством установленных законом сроков рассмотрения вашего дела.',
          },
        ],
        important:
          'Вы подаёте документы с помощью адвокатов, что минимизирует риски ошибок и ускоряет процесс коммуникации.',
      },
      4: {
        title: 'ПАКЕТ №4 «ПРЕМИУМ»',
        subtitle: 'МАКСИМАЛЬНАЯ ЗАЩИТА И СУД',
        desc: 'Для максимальной поддержки и судебной защиты.',
        items: [
          {
            title: 'Всё из «Адвокатского»',
            content:
              'Вы уже прошли оценку и понимаете свою ситуацию. Этот пакет опирается на результаты диагностики и использует их как основу для дальнейших действий. Вы не начинаете с нуля - вы действуете осознанно и по проверенной логике.',
          },
          {
            title: 'Параллельный статус',
            content:
              'Адвокатское сопровождение, направленное на получение нового статуса без потери текущей основы пребывания. Вы получаете понятную стратегию и комплект действий со стороны адвокатской канцелярии для корректного и последовательного ведения процедуры.',
          },
          {
            title: 'Иск о бездействии',
            content:
              'Если ведомство не реагирует в разумные сроки, пакет может включать подготовку и подачу процессуальных шагов против бездействия. Это позволяет перевести ситуацию из режима ожидания в управляемый юридический процесс. Судебные расходы не включены в стоимость пакета услуг. При обращении в суд они полностью оплачиваются клиентом дополнительно.',
          },
          {
            title: 'Судебное представительство',
            content:
              'Пакет предусматривает представительство интересов клиента адвокатской канцелярией в судебном производстве по соответствующей процедуре. Пользователь передаёт канцелярии полномочия на ведение дела, включая осуществление всех процессуальных действий и коммуникаций, которые ведутся в соответствии с применимыми правовыми требованиями. Судебные расходы не включены в стоимость пакета услуг. При обращении в суд они полностью оплачиваются клиентом дополнительно.',
          },
        ],
        important:
          'Вы можете зачесть стоимость предыдущих пакетов при заказе этого сопровождения.',
      },
    },
  },
  de: {
    labels: {
      included: 'WAS IST ENTHALTEN',
      important: 'WICHTIG',
      cta: {
        start: 'STARTEN',
        buy: 'KAUFEN',
      },
    },
    packages: {
      1: {
        title: 'PAKET №1 «START»',
        subtitle: 'ORIENTIERUNG & STRATEGIE',
        desc: 'Bewertung Ihrer Situation und möglicher Risiken.',
        items: [
          {
            title: 'Individuelle Einschätzung',
            content:
              'Analyse Ihrer spezifischen Situation: aktueller Aufenthaltsstatus, Dokumente, familiäre und berufliche Umstände. Ziel ist es, mögliche Risiken, Einschränkungen und realistische Perspektiven aufzuzeigen.',
          },
          {
            title: 'Migrationsstrategie',
            content:
              'Auf Grundlage Ihrer Situation wird eine persönliche Strategie für das weitere Vorgehen erarbeitet: mögliche Optionen zur Änderung des Aufenthaltstitels, deren Vor- und Nachteile sowie die erforderliche Schrittfolge.',
          },
          {
            title: 'Analyse der Paragraphen',
            content:
              'Es wird geprüft, welche Paragraphen der Gesetzgebung speziell auf Sie zutreffen, welche davon tatsächlich realisierbar sind und welche zwar formal in Betracht kommen, in der Praxis jedoch nicht erreichbar sind.',
          },
          {
            title: 'Prüfung der Voraussetzungen',
            content:
              'Sie werden erkennen, inwieweit Sie für die nächsten Schritte bereit sind: welche Voraussetzungen bereits erfüllt sind, woran es noch fehlt und welche weiteren Bedingungen noch zu erfüllen sind.',
          },
        ],
        important:
          'Diese Bewertung ist ein obligatorischer erster Schritt für alle weiteren Handlungen.',
      },
      2: {
        title: 'PAKET №2 «SELBSTSTÄNDIG»',
        subtitle: 'LÖSUNG FÜR DIE EIGENSTÄNDIGE ANTRAGSTELLUNG',
        desc: 'Alle Dokumente und Anleitungen für eine korrekte selbstständige Antragstellung.',
        items: [
          {
            title: 'Alles aus Paket «Start»',
            content:
              'Sie haben die Bewertung bereits durchlaufen. Dieses Paket baut auf den Ergebnissen der Diagnose auf. Sie starten nicht bei Null, sondern handeln bewusst und nach geprüfter Logik.',
          },
          {
            title: 'Formulare & Ausfüllhilfen',
            content:
              'Sie erhalten Formulare und Ausfüllbeispiele mit Erklärungen. Das minimiert formale Fehler und hilft zu verstehen, wie Dokumente korrekt ausgefüllt werden.',
          },
          {
            title: 'Anschreiben',
            content:
              'Das Paket enthält eine Vorlage für ein Anschreiben, das Ihre Situation und die Logik des Antrags erklärt. Dies erhöht die Chancen auf eine korrekte Bearbeitung.',
          },
          {
            title: 'Anleitung & Checkliste',
            content:
              'Eine Schritt-für-Schritt-Anleitung und Checkliste ermöglichen es Ihnen, den Prozess selbstständig zu durchlaufen, ohne etwas zu vergessen.',
          },
        ],
        important:
          'Sie reichen die Unterlagen eigenständig ein, können jedoch die Kosten für vorherige Leistungspakete beim Wechsel zur rechtlichen Unterstützung anrechnen lassen.',
      },
      3: {
        title: 'PAKET №3 «ANWALTLICH»',
        subtitle: 'ANWALTLICHE VERTRETUNG',
        desc: 'Kommunikation mit der Behörde über unsere Anwaltskanzlei.',
        items: [
          {
            title: 'Alles aus Paket «Selbstständig»',
            content:
              'Sie haben die Bewertung bereits durchlaufen. Dieses Paket baut auf den Ergebnissen der Diagnose auf. Sie starten nicht bei Null, sondern handeln bewusst und nach geprüfter Logik.',
          },
          {
            title: 'Antragstellung durch Kanzlei',
            content:
              'Ihr Antrag wird offiziell im Namen unserer Kanzlei eingereicht, was den Status und die Aufmerksamkeit der Behörde erhöht.',
          },
          {
            title: 'Vollmacht & Kommunikation',
            content:
              'Sie unterzeichnen eine Anwaltsvollmacht, und wir übernehmen den gesamten Schriftverkehr mit der Behörde und beantworten Rückfragen.',
          },
          {
            title: 'Fristenkontrolle',
            content:
              'Wir führen eine professionelle Kontrolle der Einhaltung der gesetzlichen Bearbeitungsfristen durch die Behörde durch.',
          },
        ],
        important:
          'Sie reichen die Dokumente mit anwaltlicher Hilfe ein, was Fehler minimiert und die Kommunikation beschleunigt.',
      },
      4: {
        title: 'PAKET №4 «PREMIUM»',
        subtitle: 'MAXIMALER SCHUTZ & KLAGE',
        desc: 'Für maximale Unterstützung und gerichtlichen Schutz.',
        items: [
          {
            title: 'Alles aus Paket «Anwaltlich»',
            content:
              'Sie haben die Bewertung bereits durchlaufen. Dieses Paket baut auf den Ergebnissen der Diagnose auf. Sie starten nicht bei Null, sondern handeln bewusst und nach geprüfter Logik.',
          },
          {
            title: 'Parallel-Status',
            content:
              'Anwaltliche Begleitung zur Erlangung eines neuen Status ohne Verlust der aktuellen Aufenthaltsgrundlage. Sie erhalten eine klare Strategie für ein korrektes Verfahren.',
          },
          {
            title: 'Untätigkeitsklage',
            content:
              'Reagiert die Behörde nicht in angemessener Frist, kann das Paket Schritte gegen Untätigkeit beinhalten. Dies macht die Situation rechtlich steuerbar. Gerichtskosten sind im Leistungspaket nicht enthalten. Im Falle einer gerichtlichen Verfahrenseinleitung werden diese vollständig und zusätzlich vom Auftraggeber getragen.',
          },
          {
            title: 'Gerichtliche Vertretung',
            content:
              'Das Leistungspaket umfasst die Vertretung des Mandanten durch eine Rechtsanwaltskanzlei im jeweiligen gerichtlichen Verfahren. Der Mandant überträgt der Kanzlei die Prozessvollmacht, einschließlich der Vornahme sämtlicher Verfahrenshandlungen und der Führung des Schriftverkehrs, welche nach Maßgabe der einschlägigen gesetzlichen Vorschriften erfolgen. Gerichtskosten sind im Leistungspaket nicht enthalten. Im Falle einer gerichtlichen Verfahrenseinleitung werden diese vollständig und zusätzlich vom Auftraggeber getragen.',
          },
        ],
        important:
          'Sie können die Kosten vorheriger Pakete bei Buchung dieser Betreuung anrechnen lassen.',
      },
    },
  },
  ua: {
    labels: {
      included: 'ЩО ВХОДИТЬ',
      important: 'ВАЖЛИВО',
      cta: {
        start: 'РОЗПОЧАТИ',
        buy: 'КУПИТИ',
      },
    },
    packages: {
      1: {
        title: 'ПАКЕТ №1 «СТАРТОВИЙ»',
        subtitle: 'ЮРИДИЧНА ОРІЄНТАЦІЯ ТА СТРАТЕГІЯ',
        desc: 'Правова оцінка вашої ситуації та можливих ризиків.',
        items: [
          {
            title: 'Індивідуальна оцінка',
            content:
              'Аналіз вашої конкретної ситуації: поточний статус перебування, документи, сімейні та професійні обставини. Мета - виявити можливі ризики та перспективи.',
          },
          {
            title: 'Стратегія переходу',
            content:
              'На основі вашої ситуації формується персональна стратегія подальших дій: можливі варіанти переходу, їх плюси та мінуси, послідовність кроків.',
          },
          {
            title: 'Аналіз параграфів',
            content:
              'Перевіряється, які параграфи законодавства застосовні саме до вас, які з них реальні, а які формально можливі, але на практиці недосяжні.',
          },
          {
            title: 'Оцінка готовності',
            content:
              'Ви отримуєте розуміння, наскільки ви готові до наступних кроків: які вимоги вже виконані, чого не вистачає і які умови необхідно виконати.',
          },
        ],
        important:
          "Ця оцінка є обов'язковим першим кроком для будь-яких подальших дій.",
      },
      2: {
        title: 'ПАКЕТ №2 «САМОСТІЙНИЙ»',
        subtitle: 'РІШЕННЯ ДЛЯ САМОСТІЙНОЇ ПОДАЧИ',
        desc: 'Всі документи та інструкції для коректної самостійної подачі заяви.',
        items: [
          {
            title: 'Все з пакету «Стартовий»',
            content:
              'Ви вже пройшли оцінку і розумієте свою ситуацію. Цей пакет спирається на результати діагностики та використовує їх як основу. Ви не починаєте з нуля - ви дієте свідомо.',
          },
          {
            title: 'Формуляри та приклади',
            content:
              'Ви отримуєте формуляри та приклади їх заповнення з поясненнями. Це знижує ризик формальних помилок і дозволяє зрозуміти, як саме заповнювати документи.',
          },
          {
            title: 'Супровідний лист',
            content:
              'У пакет входить шаблон супровідного листа, який пояснює вашу ситуацію та логіку звернення. Це підвищує шанси на коректний розгляд заяви.',
          },
          {
            title: 'Інструкція та чек-лист',
            content:
              'Покрокова інструкція та чек-лист дозволяють вам пройти весь процес подачі самостійно, нічого не забувши і не переплутавши порядок дій.',
          },
        ],
        important:
          'Ви подаєте документи самостійно, але можете зарахувати вартість попередніх пакетів при переході до юридичного супроводу.',
      },
      3: {
        title: 'ПАКЕТ №3 «АДВОКАТСЬКИЙ»',
        subtitle: 'АДВОКАТСЬКЕ ПРЕДСТАВНИЦТВО',
        desc: 'Комунікація з відомством через нашу адвокатську канцелярію.',
        items: [
          {
            title: 'Все з пакету «Самостійний»',
            content:
              'Ви вже пройшли оцінку і розумієте свою ситуацію. Цей пакет спирається на результати діагностики та використовує їх як основу. Ви не починаєте з нуля — ви дієте свідомо.',
          },
          {
            title: 'Подача через канцелярію',
            content:
              'Ваша заява подається офіційно від імені нашої адвокатської канцелярії, що підвищує її статус та увагу з боку відомства.',
          },
          {
            title: 'Довіреність та комунікація',
            content:
              'Ви підписуєте адвокатську довіреність, і ми беремо на себе все листування з відомством, відповідаючи на додаткові запити та уточнення.',
          },
          {
            title: 'Контроль строків',
            content:
              'Ми здійснюємо професійний контроль за дотриманням відомством встановлених законом строків розгляду вашої справи.',
          },
        ],
        important:
          'Ви подаєте документи за допомогою адвокатів, що мінімізує ризики помилок та прискорює процес комунікації.',
      },
      4: {
        title: 'ПАКЕТ №4 «ПРЕМІУМ»',
        subtitle: 'МАКСИМАЛЬНИЙ ЗАХИСТ ТА СУД',
        desc: 'Для максимальної підтримки та судового захисту.',
        items: [
          {
            title: 'Все з «Адвокатського»',
            content:
              'Ви вже пройшли оцінку і розумієте свою ситуацію. Цей пакет спирається на результати діагностики та використовує їх як основу. Ви не починаєте з нуля - ви дієте свідомо.',
          },
          {
            title: 'Паралельний статус',
            content:
              'Адвокатський супровід, спрямований на отримання нового статусу без втрати поточної підстави перебування. Ви отримуєте зрозумілу стратегію і комплекс дій з боку адвокатської канцелярії, для коректного та послідовного ведення процедури.',
          },
          {
            title: 'Позов про бездіяльність',
            content:
              'Якщо відомство не реагує в розумні строки, пакет може включати підготовку та вчинення процесуальних дій щодо оскарження бездіяльності. Це дає змогу перевести ситуацію з режиму очікування в керований юридичний процес. Судові витрати не входять до вартості пакета послуг. У разі звернення до суду вони повністю оплачуються клієнтом додатково.',
          },
          {
            title: 'Судове представництво',
            content:
              'Пакет передбачає представництво інтересів клієнта адвокатською канцелярією у судовому провадженні за відповідною процедурою. Користувач передає канцелярії повноваження на ведення справи, включаючи вчинення всіх процесуальних дій та комунікацій, які здійснюються відповідно до застосовних правових вимог. Судові витрати не входять до вартості пакета послуг. У разі звернення до суду вони повністю оплачуються клієнтом додатково.',
          },
        ],
        important:
          'Ви можете зарахувати вартість попередніх пакетів при замовленні цього супроводу.',
      },
    },
  },
};

export const PackageDetailsModal_v1: React.FC<PackageDetailsModalV1Props> = ({
  pkgId = 1,
  onClose,
  onStart,
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { language } = useLanguage();

  const toggleItem = (id: number) => {
    const next = new Set(openItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenItems(next);
  };

  const currentLangData = (modalContent as any)[language] || modalContent.ru;
  const data =
    (currentLangData.packages as any)[pkgId] || currentLangData.packages[1];

  // Определяем текст кнопки
  let btnText = currentLangData.labels.cta.buy;
  if (pkgId === 1) btnText = currentLangData.labels.cta.start;

  // Иконки как в оригинальном файле
  const HeaderIcon =
    pkgId === 4
      ? Gavel
      : pkgId === 3
      ? Scale
      : pkgId === 2
      ? ShieldCheck
      : FileText;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-[480px] rounded-[20px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header Section */}
        <div className="p-6 lg:p-8 flex items-start gap-4 border-b border-slate-50">
          <div className="p-3 bg-blue-50 text-blue-900 rounded-xl">
            <HeaderIcon size={24} />
          </div>

          <div>
            <h3 className="text-[16px] lg:text-[18px] font-bold text-[#0F172A] leading-tight uppercase">
              {data.title}
            </h3>
            <p className="text-[10px] lg:text-[11px] text-blue-900 font-black uppercase tracking-widest mt-1">
              {data.subtitle}
            </p>
          </div>
        </div>

        {/* Main Info Block */}
        <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-50 rounded-[12px] p-4 mb-6">
            <p className="text-[12px] lg:text-[13px] text-slate-600 leading-relaxed font-medium">
              {data.desc}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              {currentLangData.labels.included}
            </h4>
            <div className="space-y-1">
              {data.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="border-b border-slate-100 last:border-0"
                >
                  <button
                    onClick={() => toggleItem(idx)}
                    className="w-full py-3.5 flex items-center justify-between text-left group"
                  >
                    <span
                      className={`text-[13px] lg:text-[14px] font-bold transition-colors ${
                        openItems.has(idx)
                          ? 'text-blue-900'
                          : 'text-slate-800 group-hover:text-blue-900'
                      }`}
                    >
                      {item.title}
                    </span>
                    <div
                      className={`transition-transform duration-200 ${
                        openItems.has(idx)
                          ? 'rotate-180 text-blue-900'
                          : 'text-slate-400'
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openItems.has(idx) ? 'max-h-60 pb-5' : 'max-h-0'
                    }`}
                  >
                    <p className="text-[12px] lg:text-[13px] text-slate-600 leading-relaxed text-justify pr-2">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Block */}
          <div className="bg-blue-50/50 rounded-[12px] p-4 border border-blue-100/50">
            <h5 className="text-[10px] lg:text-[11px] font-black text-blue-900 uppercase tracking-widest mb-2 flex items-center gap-2">
              <AlertCircle size={14} /> {currentLangData.labels.important}
            </h5>
            <p className="text-[11px] lg:text-[12px] text-slate-700 leading-snug font-medium">
              {data.important}
            </p>
          </div>
        </div>

        {/* Action Zone */}
        <div className="p-6 lg:p-8 pt-2">
          <button
            onClick={() => {
              onClose();
              onStart();
            }}
            className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-full transition-all active:scale-95 shadow-lg text-[13px] uppercase tracking-widest"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};
