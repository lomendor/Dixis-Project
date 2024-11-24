import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../utils/api';

export function FeedbackForm() {
  const { t } = useTranslation();
  const [type, setType] = React.useState('issue');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const submitFeedback = useMutation({
    mutationFn: async () => {
      await api.post('/feedback', {
        type,
        title,
        description,
      });
    },
    onSuccess: () => {
      toast.success(t('feedback.submitted'));
      setTitle('');
      setDescription('');
    },
    onError: () => {
      toast.error(t('feedback.error'));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitFeedback.mutate();
      }}
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('feedback.type')}
        </label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="issue"
              checked={type === 'issue'}
              onChange={(e) => setType(e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2">{t('feedback.issue')}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="suggestion"
              checked={type === 'suggestion'}
              onChange={(e) => setType(e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2">{t('feedback.suggestion')}</span>
          </label>
        </div>
      </div>

      <Input
        label={t('feedback.title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          {t('feedback.description')}
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <Button
        type="submit"
        loading={submitFeedback.isPending}
        disabled={!title || !description || submitFeedback.isPending}
      >
        {t('feedback.submit')}
      </Button>
    </form>
  );
}