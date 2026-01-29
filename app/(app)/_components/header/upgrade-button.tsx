import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';

export function UpgradeButton() {
    return (
        <Button>
            <StarIcon className='size-4 mr-1' />
            Upgrade to Pro Plan
        </Button>
    );
}
