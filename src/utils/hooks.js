import { useState } from 'react';

export function useName(initialName = '') {
	const [name, setName] = useState(initialName);
	return [name, setName];
}

export function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	return [isOpen, setIsOpen];
}
