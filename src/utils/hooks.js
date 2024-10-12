import { useState } from 'react';

export function useName(initialName = '') {
	const [name, setName] = useState(initialName);
	return [name, setName];
}

export function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	return [isOpen, setIsOpen];
}

export function useIncome(initialValue) {
	const [income, setIncome] = useState(initialValue);
	return [income, setIncome];
}
