export interface TableColumn {
    header: string;
    field: string;
    required?: boolean;
    rowspan?: number;
    colspan?: number;
    isChildCol?: boolean;
    isParentCol?: boolean;
    hidden?: boolean;
    width?: string;
    minWidth?: string;
}

export interface TableRow {
    [key: string]: TableRowData;
}

interface TableRowData {
    text?: string;
    htmlText?: string;
    icon?: string;
    iconClass?: string;
    buttonIcon?: string;
    hasInput?: boolean;
    inputPlaceholder?: string;
    hasSelect?: boolean;
    select?: ISelectCell;
    hasCursorPointer?: boolean;
    onChange?: (newValue?: string, row?: TableRow, column?: TableColumn) => void;
    onClick?: (row: TableRow, column: TableColumn) => void;
    selectedValue?: string;
    value?: string;
    components?: TableComponentData[];
    isTitle?: boolean;
    inputType?: string;
    onInput?: (event: Event, row?: TableRow, column?: TableColumn) => void;
    inputMaxlength?: number;
    inputPattern?: string;
    textAlign?: string;
}




export interface IOption {
    label: string;
    value: string;
}

export interface ISelectCell {
    options: IOption[];
    disabled?: boolean;
}

interface TableComponentData {
    type: 'input' | 'select' | 'button' | 'icon'; // Tipo de componente
    value?: string; // Valor para inputs y selects
    placeholder?: string; // Placeholder para inputs
    options?: IOption[]; // Opciones para selects
    onChange?: (newValue?: string, row?: TableRow, column?: TableColumn) => void; // Evento onChange
    onClick?: (row: TableRow, column: TableColumn) => void; // Evento onClick
}