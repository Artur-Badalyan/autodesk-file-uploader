// Russian tooltips and microcopy for IDS Editor
export const tooltips = {
  // Header actions
  back: 'Вернуться на предыдущую страницу',
  search: 'Поиск правил применимости по имени или типу',
  import: 'Импорт IDS файла (JSON или XML)',
  exportJSON: 'Экспорт в формате внутреннего JSON',
  exportXML: 'Экспорт в формате IDS XML',
  
  // Sidebar actions
  addApplicability: 'Добавить новое правило применимости',
  addRequirement: 'Добавить новое требование',
  chooseFields: 'Выбрать поля для отображения',
  
  // Applicability types
  propertyApplicability: 'Применимость свойства - Должно содержать свойство указанного типа',
  partOfApplicability: 'Применимость части - Должно быть связано с сущностью',
  materialApplicability: 'Применимость материала - Должно иметь указанный материал',
  classificationApplicability: 'Применимость классификации - Должно быть классифицировано указанной системой',
  entityApplicability: 'Применимость сущности - Должно быть указанного типа сущности',
  
  // Field tooltips
  propertyName: 'Имя свойства для проверки',
  propertySet: 'Набор свойств, содержащий свойство',
  dataType: 'Ожидаемый тип данных значения свойства',
  propertyValue: 'Ожидаемое значение свойства',
  relation: 'Тип отношения (например, IFCRELAGGREGATES)',
  entity: 'Тип сущности для проверки',
  predefinedType: 'Предопределенный тип сущности',
  material: 'Имя или идентификатор материала',
  system: 'Система классификации (например, OmniClass, Uniclass)',
  classificationValue: 'Значение или код классификации',
  
  // Template editor
  templateEditor: 'Редактор шаблонов - Вставьте переменные типа {{project.name}}',
  insertVariable: 'Вставить переменную',
  preview: 'Предварительный просмотр шаблона с примерными данными',
  save: 'Сохранить шаблон',
  cancel: 'Отменить изменения',
  
  // Validation messages
  required: 'Это поле обязательно для заполнения',
  invalidDataType: 'Неверный формат типа данных',
  invalidXmlBaseType: 'Значение должно быть валидным XML базовым типом (xs:double, xs:integer, и т.д.)',
  
  // Onboarding tour
  tourWelcome: 'Добро пожаловать в IDS Editor! Давайте проведем краткий тур.',
  tourHeader: 'Это заголовок с поиском, опциями импорта/экспорта.',
  tourSidebar: 'Используйте боковую панель для добавления новых правил применимости и управления спецификацией.',
  tourMainArea: 'Здесь отображаются ваши правила применимости в виде карточек.',
  tourCard: 'Каждая карточка представляет правило применимости. Вы можете редактировать, изменять порядок или удалять их.',
  tourTemplate: 'Нажмите кнопку T, чтобы открыть редактор шаблонов для расширенной настройки полей.',
  tourComplete: 'Готово! Начните с добавления вашего первого правила применимости.'
};

export const validation = {
  required: 'Это поле обязательно для заполнения',
  invalidEmail: 'Пожалуйста, введите корректный email адрес',
  invalidUrl: 'Пожалуйста, введите корректный URL',
  invalidNumber: 'Пожалуйста, введите корректное число',
  invalidInteger: 'Пожалуйста, введите корректное целое число',
  invalidDouble: 'Пожалуйста, введите корректное десятичное число',
  invalidBoolean: 'Пожалуйста, введите true или false',
  invalidDate: 'Пожалуйста, введите корректную дату (YYYY-MM-DD)',
  invalidDateTime: 'Пожалуйста, введите корректную дату и время (YYYY-MM-DDTHH:mm:ss)',
  invalidTime: 'Пожалуйста, введите корректное время (HH:mm:ss)',
  invalidDuration: 'Пожалуйста, введите корректную продолжительность (PnYnMnDTnHnMnS)',
  minLength: (min) => `Должно быть не менее ${min} символов`,
  maxLength: (max) => `Должно быть не более ${max} символов`,
  minValue: (min) => `Должно быть не менее ${min}`,
  maxValue: (max) => `Должно быть не более ${max}`,
  pattern: 'Пожалуйста, соответствуйте требуемому шаблону'
};

export const tour = {
  steps: [
    {
      target: '.header',
      content: tooltips.tourHeader,
      placement: 'bottom'
    },
    {
      target: '.sidebar-col',
      content: tooltips.tourSidebar,
      placement: 'left'
    },
    {
      target: '.main-col',
      content: tooltips.tourMainArea,
      placement: 'right'
    },
    {
      target: '.card',
      content: tooltips.tourCard,
      placement: 'top'
    },
    {
      target: '.tmpl-btn',
      content: tooltips.tourTemplate,
      placement: 'top'
    }
  ]
};
